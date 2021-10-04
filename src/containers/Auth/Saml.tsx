import React, { useEffect } from "react";
import queryString from "query-string";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as signInActions from "actions/sign-in";

const Saml = ({
  samlLogin
}) => {
  const getAccessToken = url => {
    const start = url.indexOf('access_token');
    const search = `?${url.substring(start)}`;
    const {
      access_token: accessToken
    } = queryString.parse(search);
    return accessToken;
  };

  useEffect(() => {
    samlLogin(getAccessToken(window.location.href));
  });
  return <div>Redirecting...</div>;
};

const mapDispatchToProps = dispatch => bindActionCreators({
  samlLogin: signInActions.samlLogin
}, dispatch);

export default connect(null, mapDispatchToProps)(Saml);