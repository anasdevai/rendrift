import { registerRoot, Composition } from 'remotion';
import { FocusComposition } from './Composition';

registerRoot(() => {
    return (
        <Composition
            id="FocusCast"
            component={FocusComposition}
            durationInFrames={300}
            fps={30}
            width={1280}
            height={720}
            defaultProps={{
                videoSrc: '',
                tiltX: 0,
                tiltY: 0,
                zoom: 1,
                focalX: 50,
                focalY: 50,
                background: 'dark-gradient'
            }}
        />
    );
});
