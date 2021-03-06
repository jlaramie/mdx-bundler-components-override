import { bundleMDX } from "mdx-bundler";
import type { NextPage } from "next";
import Head from "next/head";
import { useMemo } from "react";
import { getMDXComponent } from "mdx-bundler/client/index";
import styles from "../styles/Home.module.css";
import path from "path";
import { MDXProvider } from "@mdx-js/react";

const components = {
  "jsx.img": () => {
    return <b>This Does Not Work</b>;
  },
  img: () => {
    return <b>This Does Not Work</b>;
  },
  Img: () => {
    return <b>This Does Work</b>;
  },
};

const Home: NextPage<{ code: any }> = ({ code }) => {
  const MdxComponent = useMemo(() => getMDXComponent(code, {}), [code]);

  console.log(code);

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>With Provider Wrap</h1>
        <MDXProvider components={components}>
          <MdxComponent components={components} />
        </MDXProvider>
        <h1>Without Provider Wrap</h1>
        <MdxComponent components={components} />
      </main>
    </div>
  );
};

export default Home;

export async function getStaticProps() {
  if (process.platform === "win32") {
    process.env.ESBUILD_BINARY_PATH = path.join(
      process.cwd(),
      "node_modules",
      "esbuild",
      "esbuild.exe"
    );
  } else {
    process.env.ESBUILD_BINARY_PATH = path.join(
      process.cwd(),
      "node_modules",
      "esbuild",
      "bin",
      "esbuild"
    );
  }

  const result = await bundleMDX({
    source: `
      <div>
          does not override: <img src="test.png" />
          <br />
          does override: <Img src="test.png" />
      </div>
    `,
    mdxOptions: (options) => {
      return {
        ...options,
        providerImportSource: "@mdx-js/react",
      };
    },
  });

  return {
    props: {
      code: result.code,
    },
  };
}
