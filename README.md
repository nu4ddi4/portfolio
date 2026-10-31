# 임동엽 · Personal Portfolio

`feentn.com`을 위한 반응형 개인 포트폴리오입니다. Cloudflare Pages에 배포합니다. 바닐라 HTML/CSS/JavaScript로 만들었고 빌드에 외부 패키지가 필요하지 않습니다.

## 실행

Node.js 20 이상에서 실행하세요.

```sh
npm run dev
```

미리보기: `http://localhost:4173`. `public/` 변경은 자동으로 빌드됩니다. 브라우저를 새로고침하면 반영됩니다.

```sh
npm run check
npm run build
npm run preview
```

## 내 정보로 변경

- `public/content.js`: 이름, 직무, 소개, 관심 분야, 이메일, 소셜 링크, 프로젝트 내용.
- `public/styles.css`: 컬러, 레이아웃, 반응형 화면.
- `public/index.html`: 섹션과 주요 문구. `{{name}}`, `{{title}}` 같은 값은 빌드 시 콘텐츠로 치환됩니다.
- `public/app.js`의 `visuals`: MVNO와 GitHub의 프로젝트 커버. 실제 화면 스크린샷을 쓰려면 프로젝트에 `image`를 지정하세요.
- `public/assets/social.svg`: 공유 이미지 원본. `social.png`는 1200×630으로 렌더링한 공유 이미지입니다.

현재 이름은 **임동엽**, GitHub는 **nu4ddi4**, 웹 프로젝트는 **MVNO**와 **감상 서가**입니다. 이메일을 설정하기 전까지 연락 섹션은 GitHub 프로필로 연결됩니다. 프로젝트 링크는 `url`, 저장소는 `repository`에 넣으면 상세 창에 표시됩니다. 도메인이 변경되면 `profile.siteUrl`과 `public/sitemap.xml`, `public/robots.txt`도 수정하세요.

### 프로젝트 추가

`public/content.js`의 `projects` 배열에 다음과 같은 객체를 추가합니다. 카드 수가 자동으로 갱신되고 기존 필터가 새 프로젝트에도 적용됩니다. `category`는 웹 프로젝트의 경우 `web`, 코드의 경우 `code`를 사용하세요. 새 분야를 추가한다면 `public/index.html`의 필터 버튼도 추가합니다.

```js
{
  id: 'new-project',
  number: '04',
  title: '새 프로젝트',
  subtitle: '프로젝트를 설명하는 한 문장.',
  category: 'web',
  label: 'WEB PROJECT',
  year: '2026',
  image: '/assets/new-project.webp', // 선택 사항. public/assets/에 이미지 추가
  tags: ['Web'],
  summary: '프로젝트 소개.',
  sections: [{ title: '만든 이유', body: '배경과 과정을 적습니다.' }],
  url: 'https://example.com',
  repository: '',
}
```

`image`와 `visual`이 없으면 프로젝트 이름을 담은 기본 커버가 표시됩니다.

## Cloudflare Pages 배포

GitHub 저장소 `nu4ddi4/portfolio`의 `main` 브랜치가 Cloudflare Pages 프로젝트 `nu4ddi4-portfolio`에 연결되어 있습니다. 변경을 push하면 `npm run build`로 빌드한 `dist/`가 자동 배포되어 https://feentn.com 에 반영됩니다.

수동 배포가 필요하면 같은 정적 파일을 하나의 Pages 서버 번들로 묶어 배포할 수도 있습니다. 빌드 시 자산과 보안 헤더를 포함하므로 별도 데이터베이스나 비밀 키가 필요하지 않습니다.

```sh
npm run build:pages
npx wrangler pages deploy dist-pages --project-name=nu4ddi4-portfolio
```

`dist-pages/`는 생성 결과이므로 Git에 저장하지 않습니다. 일반 정적 출력은 기존처럼 `npm run build` → `dist/`입니다.

### Git 자동 배포 연결

GitHub/GitLab 저장소 연결 방식:

1. 저장소에 코드를 올립니다.
2. Cloudflare **Workers & Pages → Create application → Pages → Import an existing Git repository**에서 저장소를 선택합니다.
3. Framework preset: **None**, production branch: **main**.
4. Build command: **`npm run build`**, build output directory: **`dist`**.
5. 배포 후 저장소 변경을 push하면 자동으로 다시 배포됩니다.

직접 업로드 방식은 `npm run build`로 생성된 `dist` 폴더를 Cloudflare Pages에 업로드하세요. CLI를 사용한다면 Wrangler에 인증한 후 실행합니다.

```sh
npx wrangler pages deploy dist --project-name=nu4ddi4-portfolio
```

`wrangler.jsonc`의 `name`과 실제 Pages 프로젝트 이름을 동일하게 유지하세요. API 토큰은 코드나 저장소에 넣지 마세요.

참고: https://developers.cloudflare.com/pages/get-started/git-integration/

## 포함된 기능

프로젝트 필터, 키보드로 닫을 수 있는 상세 모달, 좁은 모바일 화면의 메뉴, 이메일 복사, 화면 크기별 레이아웃, 움직임 줄이기 설정, 키보드 포커스, 기본 메타데이터, 404 페이지, Pages 보안 헤더.

폰트: Pretendard, SIL Open Font License. `public/assets/OFL.txt` 참조.
