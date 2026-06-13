import React, { Suspense } from "react";
import Grid from "./Grid/Grid";

const Jobs = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading jobs...</div>}>
        <Grid />
      </Suspense>
    </div>
  );
};

export default Jobs;
