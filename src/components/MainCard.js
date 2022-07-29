import * as React from "react";
import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import moment from "moment";

import styled from "styled-components";
import users_data from "../data/users.json";
import logs_data from "../data/logs.json";
import LineChart from "./LineChart";

const users = users_data.users;
const logs = logs_data.logs;

const MainContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  margin: 1rem;
  padding: 0.5rem;
`;

const sX = {
  width: 275,
  height: 180,
  margin: "1rem",
  padding: "0.5rem",
  border: "1px solid black",
};

const TitleContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;
`;

const TitleContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 20px;
`;

const Occupation = styled.div`
  font-weight: bold;
  opacity: 0.5;
`;

const Container = styled.div`
  margin-top: 1rem;
  display: flex;
  flex: 2;
`;
const ChartContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 2;
`;
const InfoContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: flex-end;
`;
const TextInfo = styled.div`
  font-size: 14px;
  opacity: 0.5;
`;
const NumberInfo = styled.div`
  font-size: 18px;
  font-weight: bold;
`;

const TextInfoCart = styled.div`
  font-size: 12px;
  color: gray;
  font-weight: bold;
`;
const MainCard = (props) => {
  const [updatedUsers, setUpdatedUsers] = useState(users);
  const [loader, setLoader] = useState(false);

  const usersHandler = () => {
    let updUsers = [];
    let upUsersEnd = [];

    users.map((user) => {
      let upUser = { ...user, user_log: [] };

      logs.map((log) => {
        if (log.user_id === user.id) {
          const upLog = [...upUser.user_log, log];
          upUser = { ...upUser, user_log: upLog };
        }
      });

      updUsers.push(upUser);
      return updUsers;
    });

    updUsers.map((user) => {
      let sumRev = 0;
      let sumImpression = 0;
      let sumConversion = 0;
      let conChartData = [];
      let maxDate = "";
      let minDate = "user[0].user_log[0].time;";

      user.user_log.map((log) => {
        sumRev += log.revenue;
        if (log.type === "conversion") {
          sumConversion += log.revenue;
          conChartData.push(log.revenue);

          if (log.time > maxDate) {
            maxDate = log.time;
          }
          if (log.time < minDate) {
            minDate = log.time;
          }
        } else if (log.type === "impression") {
          sumImpression += log.revenue;
        }
      });
      return upUsersEnd.push({
        ...user,
        sumRev,
        sumConversion,
        sumImpression,
        conChartData,
        maxDate,
        minDate,
      });
    });

    console.log(upUsersEnd);
    setUpdatedUsers(upUsersEnd);
  };
  useEffect(() => {
    setLoader(true);
    usersHandler();
    setLoader(false);
  }, []);

  return (
    <MainContainer>
      {updatedUsers.map((user, index) => {
        return (
          <Card sx={sX} key={index}>
            {loader ? (
              <Stack spacing={1}>
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton variant="text" />
                <Skeleton variant="rectangular" height={90} />
              </Stack>
            ) : (
              <div>
                <TitleContainer>
                  <Avatar alt={user.name} src={user.avatar} />
                  <TitleContent>
                    <Title> {user.name}</Title>
                    <Occupation>{user.occupation}</Occupation>
                  </TitleContent>
                </TitleContainer>
                <Container>
                  <ChartContent>
                    {user.conChartData && (
                      <LineChart chartData={user.conChartData} />
                    )}
                    <TextInfoCart>
                      {"Conversions "}
                      {moment(user.minDate).format("DD/MM")}
                      {" - "}
                      {moment(user.maxDate).format("DD/MM")}
                    </TextInfoCart>
                  </ChartContent>
                  <InfoContent>
                    <NumberInfo style={{ color: "orange" }}>
                      {parseInt(user.sumConversion)}
                    </NumberInfo>
                    <TextInfo>Conversion</TextInfo>
                    <NumberInfo style={{ color: "blue" }}>
                      {user.sumImpression}
                    </NumberInfo>
                    <TextInfo>Impression</TextInfo>
                    <NumberInfo style={{ color: "green" }}>
                      {parseInt(user.sumRev)}
                    </NumberInfo>
                  </InfoContent>
                </Container>
              </div>
            )}
          </Card>
        );
      })}
    </MainContainer>
  );
};
export default MainCard;
