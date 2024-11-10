
// import CircularProgress from '@mui/material/CircularProgress';

export default function Loading() {
  return (
  <div className=' flex justify-center items-center'>
  {/* <CircularProgress color="inherit" /> */}
  <div className="flex justify-center items-center">
        <div className="min-w-4 min-h-4 max-h-12 max-w-12 w-full h-full border-2 border-t-transparent border-current border-solid rounded-full animate-spin"></div>
    </div>
  </div>
  )
}
