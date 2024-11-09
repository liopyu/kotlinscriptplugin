import typescript from '@rollup/plugin-typescript';

export default {
    input: 'src/extension.ts',
    output: {
        file: 'out/extension.cjs',
        format: 'cjs'
    },
    plugins: [typescript()]
};