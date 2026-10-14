---
kind: algorithm
title: 固定端点的连续区间 gcd 短状态链
updated: 2026-10-12
status: draft
order: 1110300
tags:
  - 数论
  - 位运算
  - 区间统计
---

固定右端点 $r$，考察 $g_l=\gcd(a_l,\ldots,a_r)$。向左扩展时，每个非零严格变化得到一个**真因子**，所以在 $0\le a_i\le V$、$V\ge1$ 时，不同状态数至多 $O(1+\log V)$。含零可能先由 $0$ 变正值，需单独允许零状态。


$$
S_r=\operatorname{unique}_{g}\{\gcd(a_l,\ldots,a_r):1\le l\le r\},\qquad|S_r|=O(1+\log V).
$$


可随加入 $x=a_r$ 把前一轮每个 $(g,c)$ 变为 $(\gcd(g,x),c)$，再加入单元素 $(x,1)$，把相邻同 gcd 的计数合并。统计所有子数组 gcd 值的方案数总计 $O(n\log V)$ 次 gcd 运算（每次 gcd 的计算成本另算）。

注意谓词 $\gcd(I)=k$ 沿区间扩展一般**不单调**：$6,10,15$ 的前缀 gcd 为 $6,2,1$；而“正 gcd 大于 $1$”在正数数组上首次失败后不会恢复。
