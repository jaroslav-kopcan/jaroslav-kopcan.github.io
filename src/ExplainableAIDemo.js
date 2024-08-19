import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Button,
  Chip,
  Typography,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Tabs,
  Tab,
  Box,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const jobPostings = [
  {
    id: 1,
    title: "Software Engineer",
    company: "TechCorp",
    requirements: ["JavaScript", "React", "Node.js"],
    description:
      "We are seeking a skilled Software Engineer to join our dynamic team. The ideal candidate will develop high-quality software design and architecture. You will be working on cutting-edge web applications using modern JavaScript frameworks.",
  },
  {
    id: 2,
    title: "Data Scientist",
    company: "DataInsights",
    requirements: ["Python", "Machine Learning", "SQL"],
    description:
      "DataInsights is looking for a Data Scientist to turn data into knowledge. You'll work on complex data problems, develop predictive models, and collaborate with cross-functional teams to implement machine learning solutions.",
  },
  {
    id: 3,
    title: "UX Designer",
    company: "DesignHub",
    requirements: ["UI/UX", "Figma", "User Research"],
    description:
      "Join DesignHub as a UX Designer and help create intuitive, innovative user experiences. You'll conduct user research, create wireframes and prototypes, and collaborate with developers to bring designs to life.",
  },
];

const candidates = [
  {
    id: 1,
    name: "Alex Johnson",
    skills: ["JavaScript", "React", "Node.js", "Python"],
    experience: 3,
    description:
      "Alex is a passionate web developer with a strong foundation in JavaScript and its modern frameworks. With 3 years of experience, Ha has worked on various web applications, focusing on creating responsive and user-friendly interfaces using React. Alex is always eager to learn new technologies and has recently started exploring Python for backend development.",
    highlightPhrases: [
      { text: "passionate web developer", color: "#90EE90" },
      { text: "strong foundation in JavaScript", color: "#FFB3BA" },
      { text: "responsive and user-friendly interfaces", color: "#BAFFC9" },
      { text: "eager to learn new technologies", color: "#BAE1FF" }
    ]  
  },
  {
    id: 2,
    name: "Sam Lee",
    skills: ["Python", "Machine Learning", "SQL", "Data Visualization"],
    experience: 5,
    description:
      "Sam is an experienced data scientist with a Ph.D. in Computer Science. He has 5 years of industry experience, specializing in machine learning and predictive modeling. Sam is proficient in Python and has a strong background in SQL for data manipulation. He is particularly interested in creating meaningful data visualizations to communicate complex insights to non-technical stakeholders.",
    highlightPhrases: [
      { text: "experienced data scientist", color: "#90EE90" },
      { text: "Ph.D. in Computer Science", color: "#FFB3BA" },
      { text: "machine learning and predictive modeling", color: "#BAFFC9" },
      { text: "creating meaningful data visualizations", color: "#BAE1FF" }
    ]  
  },
  {
    id: 3,
    name: "Jordan Smith",
    skills: ["UI/UX", "Figma", "User Research", "Adobe Creative Suite"],
    experience: 4,
    description:
      "Jordan is a creative UX designer with 4 years of experience in crafting intuitive digital experiences. He has a strong background in user research and are skilled in using tools like Figma for prototyping. Jordan is passionate about accessibility in design and has experience working with cross-functional teams to bring designs from concept to implementation.",
    highlightPhrases: [
      { text: "creative UX designer", color: "#FFB3BA" },
      { text: "intuitive digital experiences", color: "#FFB3BA" },
      { text: "strong background in user research", color: "#BAFFC9" },
      { text: "passionate about accessibility in design", color: "#FFB3BA" }
    ]  
  },
];

const aiPredictions = {
  1: {
    candidateId: 1,
    explanation:
      "Alex Johnson has the most relevant skills for the Software Engineer position, with experience in JavaScript, React, and Node.js. Their recent exploration of Python also shows adaptability and eagerness to learn, which aligns well with TechCorp's dynamic environment.",
  },
  2: {
    candidateId: 2,
    explanation:
      "Sam Lee's skills in Python, Machine Learning, and SQL align perfectly with the Data Scientist role requirements at DataInsights. Their PhD and 5 years of industry experience, coupled with their ability to communicate complex insights through data visualization, make them an ideal candidate for turning data into actionable knowledge.",
  },
  3: {
    candidateId: 3,
    explanation:
      "Jordan Smith's expertise in UI/UX, Figma, and User Research makes them the ideal candidate for the UX Designer position at DesignHub. Their experience in accessibility and working with cross-functional teams aligns well with the job requirements, and their proficiency in the Adobe Creative Suite adds additional value.",
  },
};

const calculateSkillMatch = (candidateSkills, jobRequirements) => {
  const matchedSkills = candidateSkills.filter((skill) =>
    jobRequirements.includes(skill)
  );
  return (matchedSkills.length / jobRequirements.length) * 100;
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const highlightRelevantParts = (description, requirements) => {
  let highlightedDescription = description;
  requirements.forEach(req => {
    const regex = new RegExp(`\\b${req}\\b`, 'gi');
    highlightedDescription = highlightedDescription.replace(regex, match => `<span style="background-color: #90EE90;">${match}</span>`);
  });
  return <div dangerouslySetInnerHTML={{ __html: highlightedDescription }} />;
};

const highlightText = (text, phrases) => {
  if (!text || !phrases || phrases.length === 0) return text;

  let result = text;
  phrases.forEach(phrase => {
    const regex = new RegExp(`(${phrase.text})`, 'gi');
    result = result.replace(regex, `<span style="background-color: ${phrase.color};">$1</span>`);
  });
  return <div dangerouslySetInnerHTML={{ __html: result }} />;
};

const ExplainableAIDemo = () => {
  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const [userSelection, setUserSelection] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [tabValue, setTabValue] = useState(0);

  const handleNextJob = () => {
    setCurrentJobIndex((prevIndex) => (prevIndex + 1) % jobPostings.length);
    setUserSelection(null);
    setShowResult(false);
  };

  const handleCandidateSelect = (candidateId) => {
    setUserSelection(candidateId);
  };

  const handleSubmit = () => {
    setShowResult(true);
    if (
      userSelection ===
      aiPredictions[jobPostings[currentJobIndex].id].candidateId
    ) {
      setScore((prevScore) => prevScore + 1);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const currentJob = jobPostings[currentJobIndex];
  const selectedCandidate = userSelection ? candidates.find(c => c.id === userSelection) : null;

  const pieChartData = candidates.map((candidate) => ({
    name: candidate.name,
    value: calculateSkillMatch(candidate.skills, currentJob.requirements),
  }));

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
      <Typography variant="h4" gutterBottom>
        Explainable AI Job Matching Demo
      </Typography>
      <Typography variant="h6" gutterBottom>
        Score: {score}/{jobPostings.length}
      </Typography>

      <Card style={{ marginBottom: "20px" }}>
        <CardHeader title={currentJob.title} subheader={currentJob.company} />
        <CardContent>
          <Typography variant="body1" paragraph>
            {currentJob.description}
          </Typography>
          <Divider style={{ margin: "10px 0" }} />
          <Typography variant="subtitle1" gutterBottom>
            Requirements:
          </Typography>
          <div>
            {currentJob.requirements.map((req, index) => (
              <Chip key={index} label={req} style={{ margin: "0 5px 5px 0" }} />
            ))}
          </div>
        </CardContent>
      </Card>

      <Grid container spacing={3} style={{ marginBottom: "20px" }}>
        {candidates.map((candidate) => (
          <Grid item xs={12} md={4} key={candidate.id}>
            <Card
              onClick={() => handleCandidateSelect(candidate.id)}
              style={{
                cursor: "pointer",
                border:
                  userSelection === candidate.id ? "2px solid #1976d2" : "none",
              }}
            >
              <CardHeader
                title={candidate.name}
                subheader={`${candidate.experience} years experience`}
              />
              <CardContent>
                <Typography variant="body2" paragraph>
                  {candidate.description}
                </Typography>
                <Divider style={{ margin: "10px 0" }} />
                <Typography variant="subtitle2" gutterBottom>
                  Skills:
                </Typography>
                <div>
                  {candidate.skills.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      variant="outlined"
                      style={{ margin: "0 5px 5px 0" }}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!userSelection || showResult}
        >
          Submit
        </Button>
        <Button
          variant="contained"
          onClick={handleNextJob}
          disabled={currentJobIndex === jobPostings.length - 1 && showResult}
        >
          Next Job
        </Button>
      </div>

      <Dialog
        open={showResult}
        onClose={() => setShowResult(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Result</DialogTitle>
        <DialogContent>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="result tabs"
            >
              <Tab label="Explanation" />
              <Tab label="Skill Match" />
              <Tab label="Candidate Profile" />
            </Tabs>
          </Box>
          <TabPanel value={tabValue} index={0}>
            <Typography variant="h6" gutterBottom>
              {userSelection ===
              aiPredictions[jobPostings[currentJobIndex].id].candidateId
                ? "Congratulations! Your selection matches the AI's prediction."
                : "Your selection differs from the AI's prediction."}
            </Typography>
            <Typography variant="body1" paragraph>
              AI's explanation:{" "}
              {aiPredictions[jobPostings[currentJobIndex].id].explanation}
            </Typography>
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <Typography variant="h6" gutterBottom>
              Candidate Skill Match
            </Typography>
            <div style={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <Typography variant="h6" gutterBottom>Candidate Profile</Typography>
            {selectedCandidate ? (
              <>
                <Typography variant="subtitle1" gutterBottom>
                  {selectedCandidate.name} - {selectedCandidate.experience} years experience
                </Typography>
                <Typography variant="body1" paragraph>
                  {highlightText(selectedCandidate.description, selectedCandidate.highlightPhrases)}
                </Typography>
                <Typography variant="subtitle2" gutterBottom>Skills:</Typography>
                <div>
                  {selectedCandidate.skills.map((skill, index) => (
                    <Chip 
                      key={index} 
                      label={skill} 
                      variant="outlined" 
                      style={{ 
                        margin: '0 5px 5px 0',
                        backgroundColor: currentJob.requirements.includes(skill) ? '#90EE90' : 'transparent'
                      }} 
                    />
                  ))}
                </div>
                {selectedCandidate.highlightPhrases && selectedCandidate.highlightPhrases.length > 0 && (
                  <>
                    <Typography variant="subtitle2" gutterBottom style={{ marginTop: '10px' }}>Color Legend:</Typography>
                    <div>
                      {selectedCandidate.highlightPhrases.map((phrase, index) => (
                        <Chip 
                          key={index} 
                          label={phrase.text} 
                          style={{ 
                            margin: '0 5px 5px 0',
                            backgroundColor: phrase.color
                          }} 
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <Typography>No candidate selected</Typography>
            )}
          </TabPanel>

        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowResult(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ExplainableAIDemo;
