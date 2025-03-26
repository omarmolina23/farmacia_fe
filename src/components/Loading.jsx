const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <img 
      src={"/img/loading.gif"} 
      alt="Loading..." 
      className="w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-44 lg:h-44 xl:w-52 xl:h-52" />
    </div>
  );
};

export default Loading;
