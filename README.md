# binimum

a svkit portfolio inspired by Legible Prague. TS + Bun.

## dev

```sh
bun install
bun run dev
```

## check and build

```sh
bun run check
bun run lint
bun run build
bun run preview
```

## Arabic domain

The homepage serves Arabic to requests for `xn--ngb2daclk.xn--ngbc5azd` (بنيموم.شبكة) and English on other hosts. In Cloudflare, attach the Arabic hostname to the same Worker as the English site using a [Custom Domain](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/).

## browser compatibility

works on very old browsers (eg. firefox 52)
