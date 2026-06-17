export const showDialogAction = () => ({
    type: 'SHOW_DIALOG',
  });
  
  export const hideDialogAction = () => ({
    type: 'HIDE_DIALOG',
  });

  export const updateYearAndBranch = (year, yearId, branch, branchKey) => ({
    type: 'UPDATE_YEAR_BRANCH',
    payload: {
      year,
      yearId,
      branch,
      branchKey
    }
  });
  
  