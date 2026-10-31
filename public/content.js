// 이름, 한 줄 소개, GitHub 링크와 프로젝트 목록을 이 파일에서 수정하세요.
export const profile = {
  name: '임동엽',
  siteName: 'feentn.com',
  title: '포트폴리오',
  description: '직접 만든 웹 프로젝트 MVNO와 감상 서가를 소개하는 포트폴리오입니다.',
  siteUrl: 'https://feentn.com',
  github: 'https://github.com/nu4ddi4',
  intro: '필요한 것을 직접 만들고 기록합니다.',
  about: '작은 아이디어를 웹으로 옮기고, 쓰면서 발견한 점을 다시 고쳐갑니다. 이곳에 지금까지의 작업과 앞으로 만들어갈 것들을 차곡차곡 담습니다.',
};

export const projects = [
  {
    id: 'mvno',
    title: 'MVNO',
    description: '직접 만들고, 계속 다듬어가는 웹 프로젝트.',
    image: '/assets/mvno-cover.svg',
    url: 'https://mvno.feentn.com',
  },
  {
    id: 'ani',
    title: '감상 서가',
    description: '만화·소설·애니를 찾고, 관심 작품을 모으는 나만의 서가.',
    image: '/assets/ani-cover.svg',
    url: 'https://ani.feentn.com/',
  },
];
