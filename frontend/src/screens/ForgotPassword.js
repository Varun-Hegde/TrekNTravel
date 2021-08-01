import React, { useState, useEffect } from "react";
import axios from "axios";
import FormContainer from "../components/FormContainer";
import { Form, FormGroup, Label, Input } from "reactstrap";
import { Button } from "react-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useSelector } from "react-redux";
import Meta from "../components/Meta";

const ForgotPassword = ({ history }) => {
  const [email, setEmail] = useState("");
  const [errMsg, setErrMsg] = useState(null);

  const [emailChecked, setEmailChecked] = useState(false);

  const [loading, setLoading] = useState(false);

  const userStatus = useSelector((state) => state.status);
  const { isLoggedIn, userInfo } = userStatus;

  const resetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("/api/reset-password", { email });
      setLoading(false);
      setEmailChecked(true);
    } catch (error) {
      setLoading(false);
      setErrMsg(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  };

  useEffect(() => {
    if (isLoggedIn || (userInfo && userInfo.user)) history.push("/campgrounds");
  }, [userInfo, isLoggedIn, history]);

  return (
    <FormContainer>
      <Meta title="Forgot Password" />
      <h2>Reset password</h2>

      {errMsg ? <Message variant="danger">{errMsg}</Message> : null}
      {loading && <Loader />}
      {!emailChecked ? (
        <Form onSubmit={resetPassword}>
          <FormGroup>
            <Message variant="info">
              Forgotten your password? Enter your e-mail address below, and
              we'll send you an e-mail allowing you to reset it.
            </Message>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              name="email"
              placeholder="abc@def.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormGroup>
          <Button
            block
            type="submit"
            color="primary"
            disabled={email.length < 3}
          >
            Send Email
          </Button>
        </Form>
      ) : (
        <Message variant="info">Please check your mail</Message>
      )}
    </FormContainer>
  );
};

export default ForgotPassword;
