import { NextPage } from "next";
import Link from "next/link";
import React from "react";

type Props = {};

const PageMangaIndex: NextPage<Props> = (props) => {
  return (
    <div>
      <Link href="/manga/vcj52yk7kuq1ldo">To manga</Link>
    </div>
  );
};

export default PageMangaIndex;
