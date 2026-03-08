from PIL import Image, ImageDraw, ImageFont

# 简单的图片渲染脚本
width, height = 800, 1100
image = Image.new('RGB', (width, height), color='white')
draw = ImageDraw.Draw(image)

# 尝试加载中文字体，如果不存在则回退
try:
    title_font = ImageFont.truetype("/System/Library/Fonts/PingFang.ttc", 36)
    bold_font = ImageFont.truetype("/System/Library/Fonts/PingFang.ttc", 26)
    font = ImageFont.truetype("/System/Library/Fonts/PingFang.ttc", 22)
except:
    title_font = ImageFont.load_default()
    bold_font = ImageFont.load_default()
    font = ImageFont.load_default()

y = 50
draw.text((50, y), "详细解题报告", fill="red", font=title_font)
y += 60
draw.line((50, y, 750, y), fill="gray", width=2)
y += 40

def add_step(title, lines):
    global y
    draw.text((50, y), title, fill="black", font=bold_font)
    y += 40
    for line in lines:
        draw.text((70, y), "• " + line, fill="black", font=font)
        y += 35
    y += 20

add_step("1. 计算等式左边", [
    "先算括号里：13 × 23 + 24 = 299 + 24 = 323",
    "再算分数减法：5/19 - 2/17",
    "通分：(5×17 - 2×19) / 323 = (85 - 38) / 323 = 47 / 323",
    "最终左边：323 × (47 / 323) = 47"
])

add_step("2. 计算等式右边", [
    "带分数转假分数：8又122/255 = (8×255 + 122) / 255 = 2162 / 255",
    "分母部分通分：A/17 - B/15 = (15A - 17B) / 255",
    "整个右边：(2162/255) ÷ [(15A - 17B) / 255]",
    "结果：2162 / (15A - 17B)"
])

add_step("3. 建立并求解方程", [
    "让左右相等：47 = 2162 / (15A - 17B)",
    "交换位置：15A - 17B = 2162 / 47 = 46"
])

add_step("4. 寻找自然数解 A, B", [
    "观察到 15A 必须以 0 或 5 结尾",
    "则 17B 的尾数必须是 4 或 9",
    "当 B = 7 时：17 × 7 = 119 (尾数 9 符合)",
    "15A = 46 + 119 = 165 => A = 11",
    "此时 A + B = 11 + 7 = 18"
])

draw.rectangle((50, y, 750, y+60), outline="orange", width=2)
draw.text((70, y+15), "结论：A + B 的最小值为 18。", fill="black", font=bold_font)

image.save('mario-game/solution.png')
