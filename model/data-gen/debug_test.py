import re

s1 = 'export const TextComp = () => <h2 className="text-[22px] font-bold">Arbitrary Font</h2>;'
m1 = bool(re.search(r"text-\[\d+(?:px|rem)\]", s1))
print("NEXT-UI-101 match:", m1)

s2 = 'export const View = () => <div className="p-[19px] mt-[13px] gap-[11px]">Text</div>;'
m2 = bool(re.search(r"(?:p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap)-\[\d+px\]", s2))
print("NEXT-UI-105 match:", m2)

s3 = 'export const Container = () => <div className="w-[1280px] flex flex-col">Content</div>;'
m3 = bool(re.search(r"w-\[\d{3,4}px\]", s3))
print("NEXT-UI-106 match:", m3)
