import { Composition } from 'remotion';
import { Project100Ad } from './compositions/Project100Ad/Project100Ad';
import { ConsistencyVideo } from './compositions/ConsistencyVideo/ConsistencyVideo';
import { CapabilitiesDemo } from './compositions/CapabilitiesDemo/CapabilitiesDemo';

export const Root = () => {
  return (
    <>
      <Composition
        id="Project100Ad"
        component={Project100Ad}
        durationInFrames={600}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ConsistencyVideo"
        component={ConsistencyVideo}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="CapabilitiesDemo"
        component={CapabilitiesDemo}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
