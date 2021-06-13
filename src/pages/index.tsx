/// <reference types="@emotion/react/types/css-prop" />
import tw, { css } from "twin.macro";
import { Button } from "../components/button";

const container = css`
  ${tw`mx-auto m-4 p-4 rounded bg-gray-400`}
`;

export const Home = (): JSX.Element => (
  <div css={container}>
    <main>
      <h1 tw="text-5xl font-bold">
        Nextjs App with TypeScript, ESlint, Jest, Emotion, Tailwind and Twin
      </h1>
      <Button />
    </main>
  </div>
)

export default Home
