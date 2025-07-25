import { Link } from "react-router-dom";

export function AnonymousUserDecksStorageInfo() {
  return (
    <div>
      <p className="border-2 border-purple-700 text-purple-700 bg-purple-100 text-justify p-4 my-4 rounded-md lg:mx-auto lg:w-2/5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="inline relative mb-1 h-5 w-5 mr-2"
          fill="#DDD6FE"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Greetings stranger! Decks below are stored in this very browser only. If
        you{" "}
        {
          <Link className="underline font-bold" to="/login">
            sign in
          </Link>
        }
        , they will be stored in database and available to you on any device.
      </p>
    </div>
  );
}
