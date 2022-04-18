import { Joke } from "@prisma/client";
import { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/node";
import { db } from "~/utils/db.server";
import { Link, useLoaderData } from "@remix-run/react";

type LoaderData = { randomJoke: Joke };

export const loader: LoaderFunction = async () => {
  const totalJokes = await db.joke.count();
  const randomRowNumber = Math.floor(totalJokes * Math.random());

  const randomJokeList = await db.joke.findMany({
    take: 1,
    skip: randomRowNumber,
  });
  const data: LoaderData = { randomJoke: randomJokeList[0] };
  return json(data);
};

export default function JokesIndexRoute() {
  const data = useLoaderData<LoaderData>();
  return (
    <div>
      <p>Here's a random joke:</p>
      <p>{data.randomJoke.content}</p>
      <Link to={data.randomJoke.id}>"{data.randomJoke.name}" Permalink</Link>
    </div>
  );
}
