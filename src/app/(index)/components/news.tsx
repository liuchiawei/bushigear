export default function News() {
  return (
    <div className="w-full max-w-7xl h-full mx-auto p-6">
      <h1 className="text-2xl font-bold text-center">
        News
      </h1>
      <ul className="flex flex-col gap-2 text-lg [&_li]:flex [&_li]:gap-6 ">
        <li>
          <span>2025/07/11</span>
          <span>News 1</span>
          <span>內容... <a href="#">more</a></span>
        </li>
        <li>
          <span>2025/07/10</span>
          <span>News 2</span>
          <span>內容... <a href="#">more</a></span>
        </li>
        <li>
          <span>2025/07/09</span>
          <span>News 3</span>
          <span>內容... <a href="#">more</a></span>
        </li>
      </ul>
    </div>
  );
}