import StudentTable from "../components/StudentTable";
import { Box, Typography } from "@mui/material";
import { useDarkMode } from "../context/darkmodeContext";

const Home = ({isDark}) => {
 

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      

      <main className="p-6">
        <Box
          sx={{
            p: 3,
            bgcolor: isDark ? "#1f2937" : "#ffffff", 
            borderRadius: 2,
            boxShadow: 3,
            color: isDark ? "#f3f4f6" : "#111827", 
          }}
        >
          <Typography
            variant="h4"
            mb={2}
            className="text-2xl font-extrabold text-center"
          >
            Student Dashboard
          </Typography>

          <StudentTable />
        </Box>
      </main>
    </div>
  );
};

export default Home;
