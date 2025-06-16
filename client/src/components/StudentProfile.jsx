import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ContestGraph from "./ContestGraph";
import ProblemStats from "./ProblemStats";
import { Tabs, Tab, Box } from "@mui/material";

const StudentProfile = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/students/${id}`).then((res) => setStudent(res.data));
  }, [id]);

  if (!student) return <p>Loading...</p>;

  return (
    <Box sx={{ p: 3 }}>
      <h2>{student.name}'s Profile</h2>
      <Tabs value={tab} onChange={(e, newVal) => setTab(newVal)}>
        <Tab label="Contest History" />
        <Tab label="Problem Solving" />
      </Tabs>
      {tab === 0 && <ContestGraph handle={student.codeforcesHandle} />}
      {tab === 1 && <ProblemStats handle={student.codeforcesHandle} />}
    </Box>
  );
};

export default StudentProfile;