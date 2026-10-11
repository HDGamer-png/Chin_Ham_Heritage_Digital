export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  historicalNote: string;
  category: 'DiaLy' | 'NhanVat' | 'HienVat' | 'SuKien';
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'Di tích Chín Hầm nguyên thủy được thực dân Pháp xây dựng vào năm nào và dùng để làm gì?',
    options: [
      'Năm 1954, dùng làm trại giam chính trị',
      'Năm 1941, dùng làm kho cất giấu vũ khí và đạn dược của quân đội Pháp',
      'Năm 1930, dùng làm hầm trú ẩn phòng không',
      'Năm 1945, dùng làm căn cứ quân sự của phát xít Nhật',
    ],
    correctAnswer: 1,
    historicalNote:
      'Năm 1941, thực dân Pháp đã chiếm sườn đồi Ba Đồn để bí mật xây dựng 9 căn hầm kiên cố dưới lòng đất nhằm cất giấu vũ khí, khí tài và đạn dược trong Thế chiến II.',
    category: 'SuKien',
  },
  {
    id: 2,
    question: 'Ai là người đã cải tạo Chín Hầm thành khu trại biệt giam tàn bạo trong giai đoạn 1954 - 1963?',
    options: [
      'Thực dân Pháp',
      'Quân đội viễn chinh Mỹ',
      'Ngô Đình Cẩn (em trai Ngô Đình Diệm, được mệnh danh là "Chúa ngục miền Trung")',
      'Chính quyền Trần Trọng Kim',
    ],
    correctAnswer: 2,
    historicalNote:
      'Dưới thời Đệ nhất Cộng hòa, Ngô Đình Cẩn nắm trọn quyền sinh sát ở miền Trung, đã biến khu kho đạn Chín Hầm thành nơi giam giữ, tra tấn dã man các chiến sĩ cách mạng và người dân yêu nước.',
    category: 'NhanVat',
  },
  {
    id: 3,
    question: 'Trong hệ thống Chín Hầm, căn hầm nào được coi là tàn bạo nhất, có bố trí 14 chuồng cọp sắt?',
    options: ['Hầm số 8', 'Hầm số 1', 'Hầm số 4', 'Hầm số 9'],
    correctAnswer: 0,
    historicalNote:
      'Hầm số 8 nằm trên đỉnh dốc cao nhất, xây dựng ngầm hoàn toàn dưới lòng đất, bên trong dựng 14 chuồng cọp bằng khung sắt đan lưới thép gai nhốt các cán bộ kiên trung nhất.',
    category: 'DiaLy',
  },
  {
    id: 4,
    question: 'Kỷ vật chiếc lược nhôm của tù nhân thời kỳ kháng chiến thường được chế tác thủ công từ nguyên liệu gì?',
    options: [
      'Nhựa tổng hợp được viện trợ',
      'Gỗ gụ đẽo gọt từ rừng Trường Sơn',
      'Bạc nguyên chất của cai ngục làm rơi',
      'Nhôm đúc từ mảnh xác máy bay bị bắn rơi hoặc ca, thìa nhôm hỏng',
    ],
    correctAnswer: 3,
    historicalNote:
      'Người tù và các chiến sĩ đã kiên trì nhặt nhạnh từng mảnh nhôm xác máy bay hay đồ hộp phế liệu, mài phẳng trên đá và dùng đinh sắt đục từng kẽ răng để làm nên những chiếc lược mộc mạc.',
    category: 'HienVat',
  },
  {
    id: 5,
    question: 'Tập thơ và hồi ký chấn động "Sống trong mồ" tố cáo tội ác tại Chín Hầm là của tác giả nào?',
    options: [
      'Nhà thơ Tố Hữu',
      'Đồng chí Nguyễn Minh Vân (bút danh Nguyễn Đình Thư)',
      'Nhà văn Nguyễn Tuân',
      'Đồng chí Lê Duẩn',
    ],
    correctAnswer: 1,
    historicalNote:
      'Đồng chí Nguyễn Minh Vân bị giam cầm nhiều năm trong chuồng cọp Chín Hầm. Trong cảnh tăm tối nghẹt thở, ông đã sáng tác và ghi nhớ trong đầu hàng ngàn câu thơ bất hủ về sau in thành tập "Sống trong mồ".',
    category: 'NhanVat',
  },
  {
    id: 6,
    question: 'Vào ngày nào năm 1963, nhân dân Thừa Thiên Huế và lực lượng cách mạng đã kéo lên phá cửa giải phóng Chín Hầm?',
    options: [
      'Ngày 30 tháng 4 năm 1975',
      'Ngày 26 tháng 3 năm 1975',
      'Ngày 02 tháng 11 năm 1963',
      'Ngày 19 tháng 5 năm 1968',
    ],
    correctAnswer: 2,
    historicalNote:
      'Ngày 02/11/1963, sau khi chính quyền họ Ngô sụp đổ, đồng bào, học sinh sinh viên Huế cùng các chiến sĩ cách mạng đã tiến lên đồi Ba Đồn phá tan xích xiềng, giải thoát những nhân chứng sống kiên cường.',
    category: 'SuKien',
  },
  {
    id: 7,
    question: 'Để duy trì liên lạc và động viên nhau giữ vững khí tiết trong các xà lim biệt lập, tù nhân Chín Hầm đã sử dụng phương thức nào?',
    options: [
      'Gõ nhịp mật mã Morse qua vách đá và sàn xi măng',
      'Gửi thư qua bồ câu đưa thư',
      'Hát thật to giữa đêm khuya',
      'Dùng khói báo hiệu',
    ],
    correctAnswer: 0,
    historicalNote:
      'Bị cấm nói chuyện tuyệt đối, các chiến sĩ đã sáng tạo dùng đốt ngón tay, mẩu đá gõ nhịp Morse qua tường đá để truyền tin, trao đổi nghị quyết và tiếp thêm sức mạnh cho đồng chí.',
    category: 'SuKien',
  },
  {
    id: 8,
    question: 'Chiếc cùm chân sắt tại Chín Hầm thường có đặc điểm cấu tạo khắc nghiệt như thế nào?',
    options: [
      'Dây xích cao su mềm',
      'Vòng gỗ lỏng lẻo có đệm vải',
      'Khóa mã số điện tử',
      'Thanh suốt sắt rèn đặc luồn qua các bán nguyệt cùm, khóa cố định cả hai chân',
    ],
    correctAnswer: 3,
    historicalNote:
      'Cùm chân sắt được làm bằng thanh suốt sắt nặng nề dài hơn 3 mét với các khớp bán nguyệt bập chặt vào cổ chân, khiến tù nhân không thể cử động hay đứng dậy suốt nhiều tháng liền.',
    category: 'HienVat',
  },
  {
    id: 9,
    question: 'Di tích lịch sử Chín Hầm tọa lạc tại địa phận hành chính nào của thành phố Huế hiện nay?',
    options: [
      'Phường Thuận Lộc, thành phố Huế',
      'Phường An Tây, thành phố Huế',
      'Xã Hương Thọ, thành phố Huế',
      'Phường Vĩnh Ninh, thành phố Huế',
    ],
    correctAnswer: 1,
    historicalNote:
      'Khu di tích lịch sử Chín Hầm nằm dưới chân đồi Thiên An thuộc phường An Tây, thành phố Huế, cách trung tâm thành phố khoảng 6km về phía Tây Nam.',
    category: 'DiaLy',
  },
  {
    id: 10,
    question: 'Di tích Chín Hầm được Bộ Văn hóa - Thông tin (nay là Bộ VHTT&DL) xếp hạng Di tích Lịch sử Quốc gia vào năm nào?',
    options: ['Năm 1975', 'Năm 2010', 'Năm 1993', 'Năm 1985'],
    correctAnswer: 2,
    historicalNote:
      'Năm 1993, Chín Hầm chính thức được xếp hạng là Di tích Lịch sử cấp Quốc gia, trở thành "địa chỉ đỏ" thiêng liêng giáo dục truyền thống yêu nước cho thế hệ trẻ.',
    category: 'SuKien',
  },
];

export interface SchoolRanking {
  rank: number;
  schoolName: string;
  city: string;
  participants: number;
  avgScore: number;
  badge: string;
}

export const INITIAL_SCHOOL_RANKINGS: SchoolRanking[] = [
  {
    rank: 1,
    schoolName: 'THPT Chuyên Quốc Học Huế',
    city: 'Thừa Thiên Huế',
    participants: 1248,
    avgScore: 94.6,
    badge: '🥇 Xuất Sắc',
  },
  {
    rank: 2,
    schoolName: 'THPT Hai Bà Trưng (Đồng Khánh xưa)',
    city: 'Thừa Thiên Huế',
    participants: 986,
    avgScore: 91.8,
    badge: '🥈 Tiên Phong',
  },
  {
    rank: 3,
    schoolName: 'THCS Nguyễn Tri Phương',
    city: 'Thừa Thiên Huế',
    participants: 842,
    avgScore: 89.2,
    badge: '🥉 Tích Cực',
  },
  {
    rank: 4,
    schoolName: 'THPT Gia Hội',
    city: 'Thừa Thiên Huế',
    participants: 615,
    avgScore: 86.4,
    badge: 'Đoàn Kết',
  },
  {
    rank: 5,
    schoolName: 'THPT Chuyên Tiền Giang',
    city: 'Tiền Giang',
    participants: 430,
    avgScore: 85.1,
    badge: 'Giao Lưu',
  },
  {
    rank: 6,
    schoolName: 'THPT Phan Đăng Lưu',
    city: 'Thừa Thiên Huế',
    participants: 390,
    avgScore: 83.5,
    badge: 'Khám Phá',
  },
];

export const WORKSHEET_OPEN_QUESTIONS = [
  {
    id: 1,
    title: 'Câu hỏi thu hoạch 1: Không gian lịch sử',
    prompt:
      'Qua việc tham quan thực địa và khảo sát không gian số hóa Chín Hầm, em hãy nêu rõ nguyên nhân vì sao nơi đây từng được gọi là "Địa ngục trần gian miền Trung"? Cấu trúc địa hình đồi Ba Đồn có ảnh hưởng như thế nào đến sự bí mật và tàn khốc của khu trại giam?',
  },
  {
    id: 2,
    title: 'Câu hỏi thu hoạch 2: Sức mạnh tinh thần người tù',
    prompt:
      'Phân tích ý nghĩa biểu tượng của chiếc lược nhôm khắc chim bồ câu và phương thức liên lạc bằng nhịp gõ Morse qua tường đá. Những di vật và hành động này thể hiện phẩm chất gì của người chiến sĩ cách mạng trong nghịch cảnh cùng cực?',
  },
  {
    id: 3,
    title: 'Câu hỏi thu hoạch 3: Trách nhiệm thế hệ trẻ',
    prompt:
      'Là một học sinh/thế hệ trẻ thời đại số, em có thể làm gì để lan tỏa giá trị lịch sử của di tích Chín Hầm đến bạn bè trong nước và quốc tế?',
  },
];
