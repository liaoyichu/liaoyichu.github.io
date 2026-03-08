from PIL import Image, ImageDraw, ImageFont
import os

# 路径设置
font_path = "/System/Library/Fonts/PingFang.ttc"
if not os.path.exists(font_path):
    font_path = "/Library/Fonts/Arial Unicode.ttf"

def create_solution_image(output_path):
    # 增加高度以确保内容不被切断
    width, height = 950, 1650 
    bg_color = (255, 255, 255) # 纯白背景
    image = Image.new('RGB', (width, height), color=bg_color)
    draw = ImageDraw.Draw(image)

    # 颜色
    color_title = (0, 0, 0)
    color_step_bg = (240, 240, 240)
    color_text = (30, 30, 30)
    color_conclusion_bg = (255, 249, 196)

    # 字体
    try:
        title_font = ImageFont.truetype(font_path, 42)
        step_font = ImageFont.truetype(font_path, 32)
        text_font = ImageFont.truetype(font_path, 28)
        bold_font = ImageFont.truetype(font_path, 30)
    except:
        title_font = ImageFont.load_default()
        step_font = ImageFont.load_default()
        text_font = ImageFont.load_default()
        bold_font = ImageFont.load_default()

    y = 60
    draw.text((60, y), "📚 数学难题专项解析报告", fill=color_title, font=title_font)
    y += 70
    draw.line((60, y, 890, y), fill=(0, 0, 0), width=3)
    y += 50

    def add_section(title, lines):
        nonlocal y
        # 步骤标题
        draw.rectangle((60, y, 900, y + 55), fill=color_step_bg)
        draw.text((80, y + 10), title, fill=(0, 0, 0), font=step_font)
        y += 85
        for line in lines:
            # 自动换行处理 (简单版)
            draw.text((100, y), "▪ " + line, fill=color_text, font=text_font)
            y += 48
        y += 40

    add_section("第一阶段：化简等式左边", [
        "题目左边：(13 × 23 + 24) × (5/19 - 2/17)",
        "1. 计算前括号：13 × 23 + 24 = 299 + 24 = 323",
        "2. 计算后括号：5/19 - 2/17",
        "   通分分母 = 19 × 17 = 323",
        "   分子 = 5 × 17 - 2 × 19 = 85 - 38 = 47",
        "   所以后括号 = 47 / 323",
        "3. 左右相乘：323 × (47 / 323) = 47",
        "结论：等式左边最终结果为 47"
    ])

    add_section("第二阶段：化简等式右边", [
        "题目右边：8又122/255 ÷ (A/17 - B/15)",
        "1. 将带分数 8又122/255 化为假分数：",
        "   (8 × 255 + 122) / 255 = (2040 + 122) / 255 = 2162 / 255",
        "2. 化简括号内分式：A/17 - B/15",
        "   通分分母 = 17 × 15 = 255",
        "   分子 = 15A - 17B",
        "   所以括号内 = (15A - 17B) / 255",
        "3. 进行除法运算：",
        "   (2162 / 255) ÷ [(15A - 17B) / 255]",
        "   根据除法规则，抵消分母 255，得到：2162 / (15A - 17B)"
    ])

    add_section("第三阶段：列方程并求解", [
        "已知 左边 = 右边，即：",
        "47 = 2162 / (15A - 17B)",
        "移项得：15A - 17B = 2162 ÷ 47",
        "经过除法计算：15A - 17B = 46"
    ])

    add_section("第四阶段：推导 A+B 最小值", [
        "条件：A, B 为自然数，且 15A - 17B = 46",
        "1. 尾数分析：15A 的尾数只能是 0 或 5",
        "2. 若 15A 尾数为 5，则 17B 尾数须为 9 (15-9=6)",
        "   试 B=7：17 × 7 = 119 (符合尾数9)",
        "   代入方程：15A - 119 = 46 => 15A = 165 => A = 11",
        "3. 若 15A 尾数为 0，则 17B 尾数须为 4 (10-4=6)",
        "   试 B=2：17 × 2 = 34 => 15A = 80 (不整除)",
        "   试 B=12：17 × 12 = 204 => 15A = 250 (不整除)",
        "比较结果：当 A=11, B=7 时，A+B = 18 为最小值"
    ])

    # 底部结论栏
    draw.rectangle((60, y, 900, y + 100), fill=color_conclusion_bg, outline=(0,0,0), width=2)
    draw.text((120, y + 30), "✅ 最终答案：A + B 的最小值为 18", fill=(0,0,0), font=bold_font)

    image.save(output_path)

create_solution_image('math-notes/solution.png')
