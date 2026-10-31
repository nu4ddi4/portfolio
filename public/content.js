// 이름, 소개, 연락처와 프로젝트를 이 파일에서 관리합니다.
// 새 프로젝트는 projects 배열에 객체 하나를 추가하세요. README.md에 예시가 있습니다.
export const profile = {
  name: '임동엽',
  role: 'DONGYEOP LIM · DEVELOPER & MAKER',
  title: '임동엽 — 만들고, 배우고, 이어가다',
  description: '임동엽의 개인 포트폴리오. 직접 만든 웹 프로젝트 MVNO와 GitHub의 코드, 그리고 앞으로 이어질 작업을 소개합니다.',
  siteUrl: 'https://feentn.com',
  email: '', // 이메일을 입력하면 연락 섹션에 이메일과 복사 버튼이 나타납니다.
  github: 'https://github.com/nu4ddi4',
  linkedin: '',
  intro: '안녕하세요, 임동엽입니다.\n필요한 것을 직접 만들고 기록합니다.',
  about: '궁금한 것을 직접 만들어보며 답을 찾습니다. 작은 아이디어를 웹으로 옮기고, 쓰면서 발견한 점을 다시 고쳐갑니다. 이곳에 지금까지의 작업과 앞으로 만들어갈 것들을 차곡차곡 담습니다.',
  skills: ['Build', 'Learn', 'Experiment', 'Repeat'],
};

export const projects = [
  {
    id: 'mvno', number: '01', title: 'MVNO', subtitle: '직접 만들고, 계속 다듬어가는 웹 프로젝트.',
    category: 'web', label: 'WEB PROJECT', year: 'PERSONAL PROJECT', visual: 'mvno',
    tags: ['Web', 'Personal project'],
    summary: 'mvno.feentn.com에서 만나볼 수 있는 개인 웹 프로젝트입니다. 작은 필요에서 출발한 작업을 하나의 사이트로 담았습니다.',
    sections: [
      { title: '프로젝트', body: 'MVNO · 개인 웹 프로젝트. 자세한 기능과 화면은 프로젝트 사이트에서 살펴볼 수 있습니다.' },
      { title: '바로 보기', body: '아래의 사이트 방문 링크를 누르면 mvno.feentn.com으로 이동합니다.' },
    ],
    url: 'https://mvno.feentn.com', repository: '',
  },
  {
    id: 'github', number: '02', title: 'Code & curiosity', subtitle: '코드로 남겨둔 생각과 실험들.',
    category: 'code', label: 'GITHUB COLLECTION', year: '@nu4ddi4', visual: 'github',
    tags: ['GitHub', 'Code', 'Experiments'],
    summary: '직접 만든 프로젝트와 코드를 모아두는 GitHub 공간입니다. 작업의 구체적인 내용은 각 저장소에서 확인할 수 있습니다.',
    sections: [
      { title: '프로필', body: 'DongYeop Lim · @nu4ddi4' },
      { title: '코드 탐색', body: '공개 저장소와 새롭게 추가되는 프로젝트를 GitHub에서 둘러보세요.' },
    ],
    url: 'https://github.com/nu4ddi4', repository: '',
  },
];
