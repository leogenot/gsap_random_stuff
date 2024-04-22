import { breakpoints } from './breakpoints.js'

export const DEFAULT_ZOOM = 0.3

const functions = {
    px: (multiplier, remSize = 16) => `${multiplier / remSize}rem`,
    cols: i => `calc(var(--cols) * ${i} - var(--gutter))`,
    push: i => `calc(var(--cols) * ${i})`,
    // increase given value when screen is large
    // creates a fluid typography on large screens
    zoomable: (px, zoom = DEFAULT_ZOOM, from = breakpoints['page-max']) => {
        return `max(${px}, calc(${px} + ${parseInt(px) * zoom
            } * (100vw - ${from}px) / ${from}))`
    },
}

const customMedia = Object.entries(breakpoints).reduce(
    (acc, [key, val]) => ({
        ...acc,
        [`--until-${key}`]: `(max-width: ${val - 1}px)`,
        [`--${key}`]: `(min-width: ${val}px)`,
    }),
    {}
)

export default {
    plugins: {
        'postcss-nested': {},
        'postcss-functions': { functions },
        'postcss-custom-media': {
            importFrom: [{ customMedia }],
        },
    },
}