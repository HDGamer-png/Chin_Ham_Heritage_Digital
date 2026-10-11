export interface QuestStage {
  id: number;
  code: string;
  title: string;
  subtitle: string;
  historicalContext: string;
  hint: string;
}

export const QUEST_STAGES: QuestStage[] = [
  {
    id: 1,
    code: 'TOA_DO_HAM_8',
    title: 'Trạm 1: Tọa Độ Bí Mật Ba Đồn',
    subtitle: 'Định vị căn hầm biệt giam tàn khốc nhất',
    historicalContext:
      'Chín Hầm vốn là 9 kho đạn của thực dân Pháp xây dựng năm 1941 dưới lòng núi Ba Đồn. Dưới thời Ngô Đình Cẩn (1954–1963), nơi đây bị cải tạo thành trại biệt giam khét tiếng. Trong đó, Hầm số 8 là nơi tàn bạo nhất: xây dựng kiên cố trên đỉnh dốc, dùng nhốt các chiến sĩ kiên trung và nhân sĩ đối lập trong các chuồng cọp sắt.',
    hint: 'Hãy rà quét các ô tọa độ trên sa bàn sườn đồi Ba Đồn để tìm ra vị trí Hầm số 8.',
  },
  {
    id: 2,
    code: 'MAT_MA_LUOC_NHOM',
    title: 'Trạm 2: Ký Ức Rãnh Khắc Nhôm',
    subtitle: 'Giải mã mật hiệu bí mật cào bằng mũi đinh',
    historicalContext:
      'Trong hoàn cảnh ngục tối biệt giam, người tù nhặt nhạnh từng mảnh nhôm xác máy bay hay ca thìa vỡ. Họ dùng mũi đinh sắt mài nhọn kiên trì cào khắc hình chim bồ câu và con số mang niềm tin giải phóng. Dãy số này chính là mốc năm mà chế độ độc tài sụp đổ, mở toang cửa địa ngục Chín Hầm.',
    hint: 'Quan sát các con số bí mật được cào trên sống chiếc lược nhôm.',
  },
  {
    id: 3,
    code: 'NHIP_GO_XA_LIM',
    title: 'Trạm 3: Nhịp Gõ Qua Tường Đá',
    subtitle: 'Mật mã Morse gõ tường kết nối đồng chí',
    historicalContext:
      'Bị cấm nói chuyện và biệt giam trong các chuồng cọp tối tăm, các chiến sĩ cách mạng đã biến vách đá và sàn xi măng thành dây điện thoại vô hình. Họ dùng đốt ngón tay hoặc mẩu đá gõ nhịp Morse qua vách đá để truyền tin tức, động viên nhau giữ vững khí tiết.',
    hint: 'Lắng nghe hoặc quan sát nhịp gõ chấm-gạch (• -) để giải mã từ khóa thiêng liêng nhất.',
  },
  {
    id: 4,
    code: 'THOI_KHAC_PHA_NGUC',
    title: 'Trạm 4: Thời Khắc Phá Ngục',
    subtitle: 'Sắp xếp dòng thời gian ngày giải phóng 02/11/1963',
    historicalContext:
      'Đầu tháng 11 năm 1963, chính quyền Diệm - Nhu - Cẩn sụp đổ sau đảo chính. Ngày 02/11/1963, nhân dân và học sinh, sinh viên xứ Huế cùng lực lượng cách mạng đã kéo lên đồi Ba Đồn, phá tung các cánh cửa sắt Chín Hầm, giải thoát những nhân chứng sống kiên trung sau nhiều năm bị đày ải.',
    hint: 'Sắp xếp đúng thứ tự 4 sự kiện lịch sử để mở cánh cổng giải phóng cuối cùng.',
  },
];

export interface MorseQuestion {
  morsePattern: string; // e.g. "- ..- / -.. ---"
  displayMorse: string;
  audioBeeps: { duration: number; pause: number }[]; // durations in ms
  answer: string;
  meaning: string;
}

export const STAGE_3_MORSE: MorseQuestion = {
  morsePattern: '- ..- / -.. ---',
  displayMorse: '- (T)  ..- (Ư)  /  -.. (Đ)  --- (O)',
  audioBeeps: [
    // T: dash
    { duration: 300, pause: 150 },
    // pause between letters
    { duration: 0, pause: 300 },
    // U: dot dot dash
    { duration: 100, pause: 100 },
    { duration: 100, pause: 100 },
    { duration: 300, pause: 150 },
    // word pause
    { duration: 0, pause: 500 },
    // D: dash dot dot
    { duration: 300, pause: 100 },
    { duration: 100, pause: 100 },
    { duration: 100, pause: 150 },
    // pause between letters
    { duration: 0, pause: 300 },
    // O: dash dash dash
    { duration: 300, pause: 100 },
    { duration: 300, pause: 100 },
    { duration: 300, pause: 300 },
  ],
  answer: 'TU DO',
  meaning: 'TỰ DO — Tiếng lòng và lẽ sống bất diệt của người chiến sĩ cách mạng',
};

export interface TimelineEvent {
  id: string;
  title: string;
  detail: string;
  timeLabel: string;
  correctIndex: number;
}

export const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: 'ev-1',
    title: 'Biến cố chính trị tại Sài Gòn',
    detail: 'Cuộc đảo chính lật đổ gia đình họ Ngô, Ngô Đình Diệm và Ngô Đình Nhu bị hạ bệ.',
    timeLabel: '01/11/1963',
    correctIndex: 0,
  },
  {
    id: 'ev-2',
    title: 'Ngô Đình Cẩn tháo chạy',
    detail: 'Chúa ngục miền Trung Ngô Đình Cẩn hoảng loạn lẩn trốn vào Dòng Chúa Cứu Thế ở Huế.',
    timeLabel: 'Sáng 02/11/1963',
    correctIndex: 1,
  },
  {
    id: 'ev-3',
    title: 'Nhân dân và học sinh Huế kéo lên Ba Đồn',
    detail: 'Đoàn người rầm rộ mang xà beng, búa tạ tiến vào thung lũng Chín Hầm để giải thoát tù nhân.',
    timeLabel: 'Trưa 02/11/1963',
    correctIndex: 2,
  },
  {
    id: 'ev-4',
    title: 'Mở toang 9 cánh cửa địa ngục trần gian',
    detail: 'Những chiến sĩ kiên trung cuối cùng được dìu ra ánh sáng ban mai sau nhiều năm bị giam cầm.',
    timeLabel: 'Chiều 02/11/1963',
    correctIndex: 3,
  },
];
