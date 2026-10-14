export interface ArtifactHotspot {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  historicalNote: string;
  position: [number, number, number]; // 3D position [x, y, z]
  tag: string;
}

export interface ArtifactItem {
  id: string;
  name: string;
  subtitle: string;
  era: string; // Niên đại
  origin: string; // Nguồn gốc
  material: string; // Chất liệu
  dimensions: string; // Kích thước
  bunkerAssociation: string; // Địa điểm liên quan (Hầm số mấy)
  summary: string;
  narrativeQuote: string; // Lời kể nhân chứng
  witnessName: string;
  tags: string[];
  hotspots: ArtifactHotspot[];
  accentColor: string;
}

export const ARTIFACTS_DATA: ArtifactItem[] = [
  {
    id: 'chiec-luoc-nhom',
    name: 'Chiếc Lược Nhôm Khắc Chim Bồ Câu',
    subtitle: 'Khát vọng hòa bình & Tự do từ xác máy bay giặc',
    era: '1958 — 1963',
    origin: 'Chế tác bí mật trong ngục tối Chín Hầm',
    material: 'Hợp kim nhôm Duralumin (lấy từ mảnh xác máy bay bị bắn rơi)',
    dimensions: 'Dài 13.8 cm • Rộng 4.2 cm • Dày 2.5 mm',
    bunkerAssociation: 'Hầm số 4 & Hầm số 6',
    summary:
      'Được người tù chính trị bí mật mài giũa bằng đá cuội đồi Thiên Thai qua hàng trăm đêm tối. Trên sống lược khắc nổi hình tượng chim bồ câu ngậm cành nguyệt quế và dòng chữ bí mật "TỰ DO 1963" — biểu tượng cho ý chí bất khuất và niềm tin tất thắng giữa chốn địa ngục trần gian.',
    narrativeQuote:
      '“Mỗi nhát mài trên đá là một lần hy vọng. Chúng tôi phải canh chừng những đêm mưa giông sấm sét để mài lược, tiếng sét át tiếng kim loại cọ xát. Chiếc lược này gửi gắm cả cuộc đời và lời hẹn ngày về với người mẹ, người vợ nơi quê nhà.”',
    witnessName: 'Lời kể cựu tù nhân chính trị Chín Hầm',
    tags: ['Khát vọng tự do', 'Kỷ vật sinh tồn', 'Nghệ thuật trong tù'],
    accentColor: '#38bdf8',
    hotspots: [
      {
        id: 'dove-relief',
        title: 'Cánh Chim Bồ Câu Ngậm Nhành Lá',
        subtitle: 'Khắc thủ công bằng đầu đinh nhọn',
        description:
          'Biểu tượng chim bồ câu sải cánh ngậm cành ô liu được chạm khắc tinh xảo. Các đường vân lông chim được khắc tỉ mỉ từng nét nhỏ, thể hiện tình yêu hòa bình sâu sắc của người chiến sĩ cách mạng.',
        historicalNote: 'Tư liệu Bảo tàng Lịch sử Thừa Thiên Huế ghi nhận đây là tác phẩm điêu khắc kim loại độc bản của tù nhân đồi Thiên Thai.',
        position: [0.45, 0.44, 0.08],
        tag: 'Biểu tượng',
      },
      {
        id: 'comb-teeth',
        title: 'Hàng Răng Lược Mài Nhẵn Đều Tăm Tắp',
        subtitle: '28 răng lược xẻ rãnh mài nhẵn phi thường',
        description:
          'Để xẻ được từng kẽ răng lược thẳng tắp trên miếng nhôm dày 2.5mm, người tù phải dùng sợi dây thép gai tẩm cát ướt cưa đi cưa lại ròng rã suốt hơn 3 tháng trời.',
        historicalNote: 'Các đầu răng lược được bo tròn nhẵn bóng để chải tóc êm ái, chứng minh sự khéo léo phi thường trong điều kiện giam cầm khắc nghiệt.',
        position: [-0.15, -0.32, 0.06],
        tag: 'Kỹ thuật chế tác',
      },
      {
        id: 'freedom-code',
        title: 'Mật Mã Khắc Ẩn "TỰ DO 1963"',
        subtitle: 'Lời hẹn ước ngày phá tan ngục tối',
        description:
          'Dưới chân sống lưng chiếc lược khắc chìm 4 chữ số 1963 — năm mà toàn thể tù nhân Chín Hầm cùng nhân dân Thừa Thiên Huế đồng lòng đập tan xiềng xích giải thoát vào ngày 02/11/1963.',
        historicalNote: 'Mật mã này được dùng để nhận diện giữa các liên lạc viên ngầm và người nhà gửi đồ tiếp tế.',
        position: [-0.62, 0.36, 0.08],
        tag: 'Mật mã lịch sử',
      },
    ],
  },
  {
    id: 'cum-sat-ham-8',
    name: 'Cùm Chân Sắt Hai Tầng Hầm Số 8',
    subtitle: 'Chứng tích địa ngục trần gian & Ý chí kiên trung',
    era: '1954 — 1963',
    origin: 'Khu biệt giam tử ngục Hầm số 8 (Chín Hầm)',
    material: 'Sắt đúc đặc nguyên khối, chốt khóa then trượt',
    dimensions: 'Dài 85 cm • Khối lượng 11.5 kg • Đường kính vòng cùm 9 cm',
    bunkerAssociation: 'Hầm số 8 (Hầm biệt giam khốc liệt nhất)',
    summary:
      'Hầm số 8 được mệnh danh là "hầm tử ngục" — nơi biệt giam những cán bộ kiên trung nhất. Bộ cùm sắt hai tầng nặng hơn 10kg khóa chặt hai cổ chân tù nhân vào sàn xi măng ẩm ướt suốt hàng tháng trời trong bóng tối mù mịt, không gian thiếu dưỡng khí ngột ngạt.',
    narrativeQuote:
      '“Cùm sắt xiết chặt vào mắt cá chân đến tứa máu, mùa đông sắt lạnh buốt tận tủy xương, mùa hè ẩm mốc bốc mùi xông lên nghẹt thở. Nhưng đau đớn thể xác chỉ càng tôi luyện thêm lòng trung thành tuyệt đối với lý tưởng độc lập dân tộc.”',
    witnessName: 'Hồi ký nhân chứng Hầm số 8',
    tags: ['Tội ác chiến tranh', 'Hầm số 8', 'Ý chí gang thép'],
    accentColor: '#e0231c',
    hotspots: [
      {
        id: 'lock-mechanism',
        title: 'Then Chốt Khóa Kép Độc Ác',
        subtitle: 'Hệ thống then sắt trượt ngăn cử động',
        description:
          'Thanh then cài bằng sắt dày 2cm luồn xuyên qua các móc cùm, ở đầu có ổ khóa then cố định bằng khóa sắt lớn. Tù nhân một khi đã bị tra cùm thì chỉ có thể nằm ngửa trên sàn đá, hoàn toàn mất khả năng trở mình.',
        historicalNote: 'Hệ thống cùm này được chế độ Ngô Đình Cẩn đặt chế tạo riêng tại xưởng quân nhu để đàn áp phong trào yêu nước miền Trung.',
        position: [1.2, 0.25, 0.18],
        tag: 'Cơ cấu khóa',
      },
      {
        id: 'ankle-rings',
        title: 'Vòng Cùm Bán Nguyệt Sát Cổ Chân',
        subtitle: 'Vết mòn ma sát qua năm tháng',
        description:
          'Hai vòng bán nguyệt bằng sắt ôm chặt mắt cá chân. Bề mặt trong của vòng cùm có những vết mòn nhẵn do ma sát liên tục với da thịt của tù nhân trong những cơn sốt co giật.',
        historicalNote: 'Rất nhiều chiến sĩ cách mạng đã vĩnh viễn mang thương tật ở khớp cổ chân do chiếc cùm này gây ra.',
        position: [-0.4, -0.15, 0.2],
        tag: 'Dấu tích thể xác',
      },
      {
        id: 'iron-corrosion',
        title: 'Lớp Rỉ Sắt Oxy Hóa Đậm Đặc',
        subtitle: 'Chứng tích độ ẩm & khí yếm trong lòng đất',
        description:
          'Màu nâu đỏ loang lổ của oxit sắt bám dày trên thanh cùm phản ánh điều kiện độ ẩm trên 90% dưới hầm sâu, nước rỉ từ trần hầm xuống tạo môi trường bào mòn ghê gớm.',
        historicalNote: 'Mẫu phân tích hóa học cho thấy cặn rỉ sắt chứa lượng lớn muối khoáng do nước ngầm đồi Thiên Thai ngấm qua trần bê tông.',
        position: [0.3, 0.2, -0.15],
        tag: 'Khảo cổ học',
      },
    ],
  },
  {
    id: 'ca-nuoc-nhom',
    name: 'Ca Nước Nhôm Đếm Ngày Sinh Tồn',
    subtitle: 'Chiếc ca quân dụng & Cuốn lịch sinh tử của người tù',
    era: '1959 — 1963',
    origin: 'Thu giữ tại Hầm số 6 sau ngày giải cứu 02/11/1963',
    material: 'Nhôm quân dụng dập nổi, quai hàn thủ công',
    dimensions: 'Đường kính 9.5 cm • Cao 11.2 cm • Dung tích 750 ml',
    bunkerAssociation: 'Hầm số 6 & Nhà chứng tích',
    summary:
      'Mỗi ngày người tù chỉ được phát nửa ca nước cho cả ăn uống lẫn vệ sinh. Chiếc ca nhôm móp méo này trở thành vật bất ly thân và được người tù dùng mẩu đinh nhọn khắc kín các vạch đếm ngày tháng, biến nó thành một cuốn nhật ký lịch sử đếm ngược đến ngày tự do.',
    narrativeQuote:
      '“Nước ở Chín Hầm quý hơn vàng. Từng giọt nước được hứng từ rỉ trần hầm chắt chiu nuôi sống đồng đội đang sốt rét. Nhìn vào những vạch khắc trên thành ca, chúng tôi nhắc nhau: Lại thêm một ngày ta sống sót để chiến đấu!”',
    witnessName: 'Hồi ức cựu tù nhân Hầm số 6',
    tags: ['Sinh tồn ngục tối', 'Kỷ vật đồng đội', 'Nhật ký đếm ngày'],
    accentColor: '#eab308',
    hotspots: [
      {
        id: 'calendar-marks',
        title: 'Hàng Trăm Vạch Khắc Đếm Ngày',
        subtitle: 'Cuốn lịch sinh tồn khắc bằng đầu đinh',
        description:
          'Quanh thân ca có 365 vạch khắc chia thành từng cụm 5 vạch (4 vạch dọc, 1 vạch chéo gạch ngang). Mỗi vạch tương ứng với một ngày cầm cự kiên cường trong phòng giam thiếu sáng.',
        historicalNote: 'Cách đếm ngày này giúp tù nhân giữ vững khái niệm thời gian và định vị được các ngày lễ kỷ niệm lớn của dân tộc.',
        position: [0.0, 0.15, 0.85],
        tag: 'Lịch số học',
      },
      {
        id: 'dented-rim',
        title: 'Miệng Ca Móp Méo & Dấu Vết Thời Gian',
        subtitle: 'Hứng từng giọt nước rỉ trần hầm',
        description:
          'Vành ca bị móp lõm nhiều chỗ do va đập vào vách tường hầm khi người tù lần mò trong bóng đêm để đặt ca hứng nước ngầm nhỏ giọt từ khe nứt trần hầm.',
        historicalNote: 'Vết móp phản ánh sự chật chội tối tăm nơi mà tù nhân phải sống trong tư thế co quắp.',
        position: [0.55, 0.75, 0.2],
        tag: 'Dấu vết sinh tồn',
      },
      {
        id: 'base-inscription',
        title: 'Dòng Chữ "BẤT KHUẤT" Dưới Đáy Ca',
        subtitle: 'Lời thề danh dự của người chiến sĩ',
        description:
          'Dưới đáy chiếc ca nhôm được khắc chìm dòng chữ hoa "BẤT KHUẤT - 1961" như một lời răn mình và truyền lại cho người tù kế tiếp nếu người trước không may hy sinh.',
        historicalNote: 'Hiện vật được tìm thấy cùng với một mẩu than củi dùng để ghi chép các bài thơ cách mạng.',
        position: [-0.1, -0.7, 0.3],
        tag: 'Khắc ghi ý chí',
      },
    ],
  },
  {
    id: 'khuy-ao-mat-thu',
    name: 'Khuy Áo Gỗ Giấu Mật Thư Vượt Ngục',
    subtitle: 'Nghệ thuật ngụy trang truyền tin trước giờ G 1963',
    era: 'Tháng 10/1963',
    origin: 'Đường dây liên lạc bí mật giữa Hầm số 3 và ngoại đồi Thiên Thai',
    material: 'Gỗ lim tiện rỗng nắp xoay, giấy thiếc bao thuốc lá',
    dimensions: 'Đường kính 3.2 cm • Độ dày 8 mm • Nắp ren xoay 1.5 mm',
    bunkerAssociation: 'Hầm số 3 & Cổng chính đồi Thiên Thai',
    summary:
      'Chiếc khuy áo gỗ thoạt nhìn như cúc áo bà ba thông thường, nhưng bên trong được khoét rỗng một khoang tròn tí hon. Đây là nơi cất giấu bức mật thư viết bằng nước cơm trên giấy thiếc bao thuốc lá, mang mệnh lệnh phối hợp phá ngục ngày 02/11/1963.',
    narrativeQuote:
      '“Mật thư chỉ bé bằng đốt ngón tay, viết xong cuộn tròn như con nhộng nhét vào ruột khuy áo rồi dùng sáp nến bịt kín mép. Cai ngục có khám xét xé áo cũng chỉ nghĩ đó là chiếc cúc gỗ bình thường của người xứ Huế.”',
    witnessName: 'Tư liệu Ban liên lạc Tù chính trị Thừa Thiên Huế',
    tags: ['Tình báo ngục tù', 'Bí mật vượt ngục', 'Giờ G 1963'],
    accentColor: '#10b981',
    hotspots: [
      {
        id: 'secret-cavity',
        title: 'Khoang Rỗng Bí Mật Trong Lòng Gỗ',
        subtitle: 'Khoét rỗng bằng lưỡi lam cùn',
        description:
          'Bằng sự kiên trì phi thường, người tù đã dùng mẩu lưỡi lam cùn khoét rỗng lõi gỗ lim mà không làm nứt vỡ mặt ngoài, tạo thành một ngăn chứa kín khí đường kính 1.8cm.',
        historicalNote: 'Đây là hiện vật tiêu biểu cho trí tuệ và sự mưu lược của mạng lưới liên lạc tù nhân chính trị miền Nam.',
        position: [0.0, 0.25, 0.15],
        tag: 'Khoang ngụy trang',
      },
      {
        id: 'tin-foil-letter',
        title: 'Mật Thư Giấy Thiếc Bao Thuốc Lá',
        subtitle: 'Mệnh lệnh nổi dậy cứu tù nhân',
        description:
          'Mảnh giấy thiếc tráng bạc lấy từ bao thuốc lá bỏ đi, viết bằng mẩu tăm tre với nội dung cô đọng: "Đồng bào nổi dậy - Giải phóng Thiên Thai - Chuẩn bị phá khóa".',
        historicalNote: 'Bức thư này được chuyển ra ngoài ngày 28/10/1963, mở đường cho cuộc giải phóng ngày 02/11/1963.',
        position: [0.35, -0.15, 0.25],
        tag: 'Bức mật thư',
      },
      {
        id: 'thread-holes',
        title: 'Bốn Lỗ Khâu Áo Ngụy Trang',
        subtitle: 'Đính chặt vào vạt áo tù nhân',
        description:
          'Bốn lỗ nhỏ xỏ chỉ khâu cúc áo được khoan xuyên qua lớp vỏ ngoài để đính cúc vào áo như bình thường, che giấu hoàn hảo đường ren xoay của nắp khuy.',
        historicalNote: 'Sợi chỉ khâu được xe từ sợi bao tải rách để tạo vẻ tự nhiên cũ kỹ nhất.',
        position: [-0.3, 0.1, -0.1],
        tag: 'Vỏ bọc hoàn hảo',
      },
    ],
  },
];
