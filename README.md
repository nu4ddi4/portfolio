# feentn.com · 포트폴리오

서비스와 게임을 소개하는 첫 화면, 네 프로젝트의 상세 페이지, 페이지 마지막의 소개 섹션을 담은 개인 포트폴리오입니다.

- 사이트: https://feentn.com
- 프로젝트: 감상 서가, 파일 서버, 한 번만 더! (OneMoreTry), 김 대리, 나 좀 밀어봐 (office-chair-game)
- 상세 페이지: `/projects/ani/`, `/projects/dl/`, `/projects/omt/`, `/projects/chair/`
- 배포: GitHub `nu4ddi4/portfolio` → Cloudflare Pages `nu4ddi4-portfolio`

## 실행

Node.js 20 이상에서 별도 패키지 설치 없이 실행합니다.

```sh
npm run dev
```

미리보기는 `http://localhost:4173`입니다. `public/`와 `templates/` 변경은 자동 빌드되며 새로고침하면 반영됩니다.

```sh
npm run check
npm run build
npm run preview
```

## 내용 수정

`public/content.js`에서 이름, 소개, GitHub 주소와 프로젝트 목록을 수정하세요. 프로젝트는 다음 형식으로 `projects` 배열에 추가합니다.

```js
{
  id: 'new-project',
  title: '새 프로젝트',
  description: '핵심을 설명하는 한 문장.',
  category: '개인 웹 프로젝트', // 선택 사항
  focus: '작업 주제', // 선택 사항
  image: '/assets/new-project.webp', // 선택 사항. public/assets/에 이미지 추가
  url: 'https://example.com',
}
```

`details`가 있는 프로젝트는 `/projects/{id}/`에 정적 상세 페이지를 생성합니다. 현재 네 프로젝트는 카드의 **더 알아보기**를 통해 상세 페이지로 이동하고, 상세 페이지에서 서비스·GitHub·다운로드 링크로 연결됩니다. 상세 문구는 `public/content.js`의 `details`에서 수정합니다. `lead`와 `overview`는 짧은 소개, `features`·`implementation`·`controls`는 작업 상세, `live`·`repo`·`download`·`sourceUrl`은 연결 영역입니다. 기술 스택·실적·제작 기간은 확인된 내용만 추가하세요.

OMT 타이틀·플레이 이미지는 원본 저장소의 `docs/images/`에서 가져왔습니다. chair 표지는 게임 화면이 아닌 소개 일러스트입니다.

이름과 프로젝트는 빌드 시 HTML에 반영됩니다. 홈은 프로젝트 → 소개가 이어지는 단일 페이지입니다. 상단의 프로젝트·소개 링크는 `#work`와 `#about`으로 스크롤하며, 별도 탭 전환이나 JavaScript 없이 동작합니다. 소개는 항상 프로젝트 목록 아래에 표시됩니다.

- `public/index.html`: 홈 구성과 메타데이터.
- `templates/project.html`: 프로젝트 상세 페이지 공통 구성.
- `scripts/build.mjs`: 홈·상세 페이지·사이트맵 생성.
- `public/styles.css`: 색, 글꼴, 반응형 레이아웃.
- `public/assets/social.svg`: 공유 이미지 원본. 수정 후 `social.png`도 1200×630으로 렌더링하세요.
- 도메인 변경 시 `profile.siteUrl`, `public/robots.txt`를 수정하세요. 사이트맵은 빌드 시 실제 프로젝트 경로를 기준으로 생성됩니다.

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

폰트: [Wanted Sans](https://github.com/wanteddev/wanted-sans), SIL Open Font License (`public/assets/WantedSans-OFL.txt`). `public/assets/wanted-sans.woff2`를 자체 호스팅합니다. 원본 Wanted Sans Variable에서 KS X 1001의 한글 2,350자, 기본 라틴·한글 자모와 현재 페이지에 사용한 문자를 포함해 웹용으로 서브셋했습니다. 새 문자를 추가할 때는 글리프 포함 여부를 확인하고, 필요하면 원본에서 서브셋을 다시 생성하세요. 누락된 문자는 시스템 한글 폰트로 표시됩니다.
