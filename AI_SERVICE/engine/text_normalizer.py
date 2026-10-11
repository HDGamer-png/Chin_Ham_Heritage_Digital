"""
Bản chuẩn hóa văn bản tiếng Việt và nhận diện thực thể lịch sử Chín Hầm
"""
import re
import unicodedata

# Bảng chuyển đổi tiếng Việt có dấu sang không dấu
INTAB = "ạảãàáâậầấẩẫăắằặẳẵóòỏõọôốồổỗộơớờởỡợéèẻẽẹêếềểễệúùủũụưứừửữựíìỉĩịýỳỷỹỵđ"
OUTTAB = "a"*17 + "o"*17 + "e"*11 + "u"*11 + "i"*5 + "y"*5 + "d"
TRANSTAB = str.maketrans(INTAB + INTAB.upper(), OUTTAB + OUTTAB.upper())

def remove_vietnamese_accents(text: str) -> str:
    """Loại bỏ dấu tiếng Việt để phục vụ tìm kiếm mờ (fuzzy search)"""
    if not text:
        return ""
    text = text.translate(TRANSTAB)
    # Chuẩn hóa unicode
    text = unicodedata.normalize('NFKD', text)
    return text

def normalize_text(text: str) -> str:
    """Làm sạch và chuẩn hóa khoảng trắng, chữ thường"""
    if not text:
        return ""
    text = text.lower()
    text = re.sub(r'[\r\n\t]+', ' ', text)
    text = re.sub(r'[^\w\s\dàáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

# Danh sách từ khóa thực thể quan trọng có trọng số cao
HISTORICAL_ENTITIES = {
    'ngo dinh can': ['ngô đình cẩn', 'ngo dinh can', 'cậu cẩn', 'cau can', 'bạo chúa miền trung', 'cố vấn chỉ đạo miền trung'],
    'chin ham': ['chín hầm', 'chin ham', '9 hầm', '9 ham', 'đồi ba đồn', 'doi ba don'],
    'ham 1': ['hầm 1', 'hầm số 1', 'ham 1', 'ham so 1'],
    'ham 2': ['hầm 2', 'hầm số 2', 'ham 2', 'ham so 2'],
    'ham 3': ['hầm 3', 'hầm số 3', 'ham 3', 'ham so 3'],
    'ham 4': ['hầm 4', 'hầm số 4', 'ham 4', 'ham so 4', 'chuồng cọp', 'chuong cop'],
    'ham 5': ['hầm 5', 'hầm số 5', 'ham 5', 'ham so 5'],
    'ham 6': ['hầm 6', 'hầm số 6', 'ham 6', 'ham so 6'],
    'ham 7': ['hầm 7', 'hầm số 7', 'ham 7', 'ham so 7'],
    'ham 8': ['hầm 8', 'hầm số 8', 'ham 8', 'ham so 8'],
    'ham 9': ['hầm 9', 'hầm số 9', 'ham 9', 'ham so 9'],
    'pha ham 1963': ['phá hầm', 'pha ham', '02/11/1963', '2/11/1963', 'giải phóng chín hầm', 'đập tan xiềng xích'],
    'nha chung tich': ['nhà chứng tích', 'nha chung tich', 'tả vu', 'hữu vu', 'trưng bày', 'sa bàn'],
    'dai tuong niem': ['đài tưởng niệm', 'dai tuong niem', 'bia di tích', 'tượng đài'],
    'den huyen tran': ['đền huyền trân', 'huyền trân công chúa'],
    'audio guide': ['audio guide', 'thuyết minh tự động'],
    'tham quan': ['lộ trình', 'tham quan', 'vé', 'thời gian', 'địa chỉ', 'đường đi'],
}

def extract_entities(query: str) -> list[str]:
    """Trích xuất các thực thể lịch sử có trong văn bản với kiểm tra ranh giới từ (word boundary)"""
    found = []
    norm = normalize_text(query)
    norm_no_accent = remove_vietnamese_accents(norm)

    # 1. Trích xuất chính xác các hầm 1 đến 9 bằng regex
    ham_matches = re.findall(r'\b(?:h[aầ]m|ham)\s*(?:s[oố]|so)?\s*([1-9])\b', norm)
    for num in ham_matches:
        key = f"ham {num}"
        if key not in found:
            found.append(key)

    # 2. Trích xuất các thực thể khác
    for entity_key, aliases in HISTORICAL_ENTITIES.items():
        if entity_key.startswith('ham '):
            continue  # Đã xử lý bằng regex chính xác ở trên
        for alias in aliases:
            # Kiểm tra xem alias có xuất hiện độc lập trong câu không
            alias_clean = normalize_text(alias)
            alias_no_acc = remove_vietnamese_accents(alias_clean)
            if f" {alias_clean} " in f" {norm} " or f" {alias_no_acc} " in f" {norm_no_accent} ":
                if entity_key not in found:
                    found.append(entity_key)
                break
    return found
