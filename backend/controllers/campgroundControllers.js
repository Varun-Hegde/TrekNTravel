const asyncHandler = require("express-async-handler");
const Campground = require("../models/campgroundModel");
const { populate } = require("../models/reviewModel");
const Review = require("../models/reviewModel");
const Follow = require("../models/followersModel");
const { cloudinary } = require("../cloudinary/index");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const Tag = require("../models/tagModel");

const {
  newLikeNotification,
  removeLikeNotification,
  newCommentNotification,
  removeCommentNotification,
} = require("../utils/notificationActions");

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dummy = new Schema({
  name: String,
});

const Dummy = mongoose.model("Dummy", dummy);

module.exports.getAllCampgrounds = asyncHandler(async (req, res) => {
  //FOR PAGINATION

  const pageSize = 12;
  const page = Number(req.query.pageNumber) || 1;
  const count = await Campground.countDocuments();

  const campgrounds = await Campground.find({})
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: "desc" });
  if (campgrounds)
    res.json({ campgrounds, page, pages: Math.ceil(count / pageSize) });
  else {
    res.status(404);
    throw new Error("No Campgrounds found");
  }
});

module.exports.getParticularCampground = asyncHandler(
  async (req, res, next) => {
    let campground = await Campground.findById(req.params.id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
          select: "-password",
        },
      })
      .populate("author", "username email")
      .populate("tags");
    if (campground) res.json(campground);
    else {
      res.status(404);
      throw new Error("Campground not found ");
    }
  }
);

module.exports.postNewCampground = asyncHandler(async (req, res) => {
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.location,
      limit: 1,
    })
    .send();
  const campground = new Campground(req.body);
  if (!geoData.body.features[0]) {
    res.status(422);
    throw new Error("Add a valid location");
  }
  campground.tags = [];

  for (let tag of req.body.tags) {
    tag = tag.toLowerCase();
    let tagExists = await Tag.findOne({ tag });
    if (!tagExists) {
      const newTag = new Tag({ tag });
      tagExists = await newTag.save();
    }
    tagExists.places.push(campground._id);
    campground.tags.push(tagExists);
    await tagExists.save();
  }

  campground.author = req.user;
  campground.geometry = geoData.body.features[0].geometry;
  console.log("geo is****", geoData.body.features[0]);
  await campground.save();
  res.status(201);
  res.json(campground);
});

module.exports.updateCampground = asyncHandler(async (req, res) => {
  if (!req.body) req.body = {};
  console.log(req.body);
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.location,
      limit: 1,
    })
    .send();

  let campground = await Campground.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  campground.geometry = geoData.body.features[0].geometry;
  campground = await campground.save();
  if (!campground) {
    res.status(404);
    throw new Error("Campground not found");
  }
  let updatedCamp = campground;
  //REMOVE IMAGES FROM DATABASE(IF ANY)
  if (req.body.deleteImages.length > 0) {
    await campground.updateOne({
      $pull: { image: { $in: req.body.deleteImages } },
    });
    updatedCamp = await campground.save();
    //DELETE FROM CLOUD
    for (let img of req.body.deleteImages) {
      let fileName;
      let a = img.split("/");
      a.reverse();
      fileName = a[1] + "/" + a[0];
      let src = fileName.split(".")[0];
      await cloudinary.uploader.destroy(src);
    }
  }
  res.status(200).json(updatedCamp);
});

module.exports.deleteCampground = asyncHandler(async (req, res) => {
  const campground = await Campground.findByIdAndDelete(req.params.id);
  if (!campground) {
    res.status(404);
    throw new Error("Campground not found");
  }

  res.status(200).json(campground);
});

module.exports.postNewReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id).populate("reviews");
  if (!campground) {
    res.status(404);
    throw new Error("Campground not found");
  }
  const alreadyReviewed = campground.reviews.find(
    (r) => r.author._id.toString() === req.user._id.toString()
  );
  if (alreadyReviewed) {
    res.status(400);
    throw new Error("You already added a review");
  }

  const review = new Review(req.body);
  review.author = req.user;
  campground.reviews.push(review);

  let totalReviews = 0;
  campground.numReviews = campground.reviews.length;

  campground.rating =
    campground.reviews.reduce((acc, item) => item.rating + acc, 0) /
    campground.reviews.length;

  const addedReview = await review.save();
  const newCamp = await campground.save();

  if (newCamp.author.toString() !== req.user._id.toString()) {
    await newCommentNotification(
      newCamp._id.toString(),
      addedReview._id.toString(),
      req.user._id,
      newCamp.author.toString(),
      addedReview.body
    );
  }
  res.status(201);
  res.json(newCamp);
});

module.exports.deleteReview = asyncHandler(async (req, res) => {
  const { id, reviewId } = req.params;
  const campground = await Campground.findById(id);
  const review = await Review.findById(reviewId);
  if (!campground) {
    res.status(404);
    throw new Error("Campground not found");
  }
  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }

  await Campground.findByIdAndUpdate(
    id,
    { $pull: { reviews: reviewId } },
    { new: true, runValidators: true }
  );
  const deletedReview = await Review.findByIdAndDelete(reviewId);
  const newCamp = await Campground.findById(id).populate("reviews");
  let rating = 0;
  if (newCamp.reviews.length > 0)
    rating =
      newCamp.reviews.reduce((acc, item) => item.rating + acc, 0) /
      newCamp.reviews.length;
  newCamp.rating = rating;
  await newCamp.save();

  if (newCamp.author.toString() !== req.user._id.toString()) {
    await removeCommentNotification(
      newCamp._id.toString(),
      deletedReview._id.toString(),
      req.user._id,
      newCamp.author.toString()
    );
  }

  res.status(200).json(deletedReview);
});

module.exports.like = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);

  if (!campground) {
    res.status(404);
    throw new Error("Campground not found");
  }
  let foundUserLike = campground.likes.some(
    (like) => like.toString() === req.user._id.toString()
  );

  if (!foundUserLike) {
    campground.likes.push(req.user._id);

    // Add like notification:
    // If we are liking our own posts, don't send notifications
    if (campground.author.toString() !== req.user._id.toString()) {
      await newLikeNotification(
        req.user._id.toString(),
        campground._id.toString(),
        campground.author.toString()
      );
    }
  } else {
    campground.likes.pull(req.user._id);

    // If we are disliking our own posts, don't send notifications
    if (campground.author.toString() !== req.user._id.toString()) {
      await removeLikeNotification(
        req.user._id.toString(),
        campground._id.toString(),
        campground.author.toString()
      );
    }
  }

  const updatedCampground = await campground.save();
  //console.log(updatedCampground);
  res.json({ success: "true" });
});

module.exports.editReview = asyncHandler(async (req, res) => {
  const { id, reviewId } = req.params;
  const campground = await Campground.findById(id).populate("reviews");
  if (!campground) {
    res.status(404);
    throw new Error("Campground not found");
  }
  let comment = await Review.findById(reviewId);
  if (!comment) {
    res.status(404);
    throw new Error("Review not found");
  }
  let oldRating = comment.rating;
  comment.body = req.body.body;
  comment.rating = req.body.rating;
  const updatedComment = await comment.save();
  const newCamp = await Campground.findById(id).populate("reviews");
  newCamp.rating =
    newCamp.reviews.reduce((acc, item) => item.rating + acc, 0) /
    newCamp.reviews.length;
  await newCamp.save();
  res.json(updatedComment);
});

module.exports.myFeed = asyncHandler(async (req, res) => {
  let id = req.user._id;
  const followingId = await Follow.find({ follower: id }, "following");
  const ids = [];

  for (let item of followingId) {
    ids.push(item.following);
  }

  const pageSize = 12;
  const page = req.query.pageNumber || 1;
  const count = await Campground.countDocuments({ author: { $in: ids } });

  const campgrounds = await Campground.find({ author: { $in: ids } })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: "desc" });

  if (campgrounds)
    res.json({ campgrounds, page, pages: Math.ceil(count / pageSize) });
  else {
    res.status(404);
    throw new Error("No Campgrounds found");
  }
});
