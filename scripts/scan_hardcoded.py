import os, re

root = r'C:\Users\jun\ai-toolbox\src'
hardcoded = []

for dirpath, dirs, files in os.walk(root):
    if 'admin' in dirpath or '.next' in dirpath:
        continue
    for fname in files:
        if not fname.endswith('.tsx'):
            continue
        path = os.path.join(dirpath, fname)
        with open(path, encoding='utf-8') as f:
            content = f.read()

        rel = path.replace(root, '')

        # Find >Hardcoded Text< in JSX
        matches = re.findall(r'>\s*([A-Z][a-zA-Z]+(?:\s+[A-Za-z]+)+)[.!]?\s*<', content)
        for txt in matches:
            idx = content.find(txt)
            if idx == -1:
                continue
            before = content[max(0,idx-200):idx]
            after = content[idx:min(len(content),idx+len(txt)+5)]
            # Skip if inside i18n pattern or fallback
            if re.search(r'(t\.\w+|dict|getDictionary|fallback|settings\b|\.nav\b|home\.|blog\b.*\||footer\b.*\||toolPage\b.*\||\|\|)', before):
                continue
            hardcoded.append(f'{rel:50s} line ~{content[:idx].count(chr(10))+1}  "{txt[:60]}"')

for h in hardcoded:
    print(h)
print(f'\nTotal: {len(hardcoded)}')
