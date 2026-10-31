# 임동엽 · Portfolio

이름, 한 줄 소개, 프로젝트 목록과 GitHub 링크만 담은 개인 포트폴리오입니다.

- 사이트: https://feentn.com
- 프로젝트: MVNO, 감상 서가
- 배포: GitHub `nu4ddi4/portfolio` → Cloudflare Pages `nu4ddi4-portfolio`

## 실행

Node.js 20 이상에서 별도 패키지 설치 없이 실행합니다.

```sh
npm run dev
```

미리보기는 `http://localhost:4173`입니다. `public/` 변경은 자동 빌드되며 새로고침하면 반영됩니다.

```sh
npm run check
npm run build
npm run preview
```

## 내용 수정

`public/content.js`에서 이름, 한 줄 소개, GitHub 주소와 프로젝트 목록을 수정하세요. 프로젝트는 다음 형식으로 `projects` 배열에 추가합니다.

```js
{
  id: 'new-project',
  title: '새 프로젝트',
  description: '핵심을 설명하는 한 문장.',
  url: 'https://example.com',
}
```

이름과 프로젝트는 빌드 시 HTML에 반영됩니다. 브라우저 JavaScript 없이도 모든 내용과 링크를 사용할 수 있습니다.

- `public/index.html`: 페이지 구성과 메타데이터.
- `public/styles.css`: 색, 글꼴, 반응형 레이아웃.
- `public/assets/social.svg`: 공유 이미지 원본. 수정 후 `social.png`도 1200×630으로 렌더링하세요.
- 도메인 변경 시 `profile.siteUrl`, `public/sitemap.xml`, `public/robots.txt`도 수정하세요.

## 배포

`main`에 push하면 Cloudflare Pages가 `npm run build`를 실행해 `dist/`를 자동 배포합니다.

- Production branch: `main`
- Build command: `npm run build`
- Output directory: `dist`

수동 정적 배포:

```sh
npm run build
npx wrangler pages deploy dist --project-name=nu4ddi4-portfolio
```

필요할 경우 동일 사이트를 Pages Advanced Mode 번들로 만들 수도 있습니다.

```sh
npm run build:pages
npx wrangler pages deploy dist-pages --project-name=nu4ddi4-portfolio
```

`dist/`와 `dist-pages/`는 생성 결과이므로 Git에 저장하지 않습니다.

폰트: Pretendard, SIL Open Font License (`public/assets/OFL.txt`).
