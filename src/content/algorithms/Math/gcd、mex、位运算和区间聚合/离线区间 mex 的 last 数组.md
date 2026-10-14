---
kind: algorithm
title: 离线区间 mex 的 last 数组
updated: 2026-10-12
status: draft
order: 1110700
tags:
  - 数论
  - 位运算
  - 区间统计
---

以 **1-indexed** 扫右端点 $r$，令 $\operatorname{last}_r[v]$ 为值 $v$ 在前缀 $[1,r]$ 的最后出现位置（不存在则记为 $0$）。区间 $[l,r]$ 中缺失 $v$ 当且仅当


$$
\boxed{v\notin\{a_l,\ldots,a_r\}\iff\operatorname{last}_r[v]<l.}
$$


在值域线段树中维护所有 last 的**区间最小值**，寻找最小的 $v$ 使 $\operatorname{last}_r[v]<l$，即可查询 $\operatorname{mex}([l,r])$。每次修改和查询均 $O(\log n)$，有 $q$ 个按右端点组织的询问时共 $O((n+q)\log n)$。
