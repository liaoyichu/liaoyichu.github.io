from PIL import Image, ImageDraw, ImageFont
import os

# 路径设置
font_path = "/System/Library/Fonts/PingFang.ttc"
if not os.path.exists(font_path):
    font_path = "/Library/Fonts/Arial Unicode.ttf" # Fallback for other systems if needed

def create_solution_image(output_path):
    width, height = 900, 1300
    # 使用淡蓝色背景，更像笔记本
    bg_color = (245, 250, 255)
    image = Image.new('RGB', (width, height), color=bg_color)
    draw = ImageDraw.Draw(image)

    # 颜色定义
    color_title = (211, 47, 47)  # 红色
    color_step = (25, 118, 210)  # 蓝色
    color_text = (33, 33, 33)    # 深灰
    color_accent = (56, 142, 60) # 绿色

    # 字体加载
    try:
        title_font = ImageFont.truetype(font_path, 40)
        step_font = ImageFont.truetype(font_path, 30)
        text_font = ImageFont.truetype(font_path, 26)
        bold_font = ImageFont.truetype(font_path, 28)
    except:
        title_font = ImageFont.load_default()
        step_font = ImageFont.load_default()
        text_font = ImageFont.load_default()
        bold_font = ImageFont.load_default()

    y = 60
    # 标题
    draw.text((60, y), "📝 数学题目深度解析", fill=color_title, font=title_font)
    y += 80
    draw.line((60, y, 840, y), fill=(200, 200, 200), width=2)
    y += 40

    def add_section(title, lines):
        nonlocal y
        # 步骤标题背景
        draw.rectangle((60, y, 320, y + 45), fill=(225, 235, 245))
        draw.text((70, y + 5), title, fill=color_step, font=step_font)
        y += 70
        for line in lines:
            draw.text((90, y), "• " + line, fill=color_text, font=text_font)
            y += 45
        y += 30

    add_section("第一步：左边算式", [
        "原式：(13 × 23 + 24) × (5/19 - 2/17)",
        "1. 算第一个括号：13 × 23 + 24 = 299 + 24 = 323",
        "2. 算第二个括号：(5/19 - 2/17)",
        "   通分：(5×17 - 2×19) / (19×17) = (85 - 38) / 323",
        "   结果：47 / 323",
        "3. 左边最终：323 × (47 / 323) = 47"
    ])

    add_section("第二步：右边算式", [
        "原式：8又122/255 ÷ (A/17 - B/15)",
        "1. 带分数转假分数：(8×255 + 122) / 255 = 2162 / 255",
        "2. 分母通分：A/17 - B/15 = (15A - 17B) / 255",
        "3. 右边最终：(2162/255) ÷ [(15A-17B)/255]",
        "   抵消255得到：2162 / (15A - 17B)"
    ])

    add_section("第三步：解不定方程", [
        "令 47 = 2162 / (15A - 17B)",
        "则 15A - 17B = 2162 ÷ 47 = 46"
    ])

    add_section("第四步：寻找最小解", [
        "15A - 17B = 46，A和B都是自然数",
        "因为 15A 尾数是 0 或 5，46 尾数是 6",
        "所以 17B 的尾数必须是 4 或 9",
        "尝试 B=7：17 × 7 = 119（尾数符合）",
        "15A = 46 + 119 = 165  =>  A = 11",
        "此时 A + B = 11 + 7 = 18"
    ])

    # 结论框
    draw.rectangle((60, y, 840, y + 80), fill=(232, 245, 233), outline=color_accent, width=3)
    draw.text((100, y + 20), "✨ 最终结论：A + B 的最小值为 18", fill=color_accent, font=bold_font)

    image.save(output_path)

create_solution_image('math-notes/solution.png')
