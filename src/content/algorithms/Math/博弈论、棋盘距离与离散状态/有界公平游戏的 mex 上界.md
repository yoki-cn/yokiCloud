---
kind: algorithm
title: 有界公平游戏的 mex 上界
updated: 2026-10-12
status: draft
order: 1100600
tags:
  - 博弈论
---

若某状态有 $d$ 个**不同**后继状态，则 $\operatorname{sg}(s)\le d$；后继可重复，但 mex 只看不同 SG 值。

对于明确给出的 DAG，逆拓扑计算 SG，时间 $O(V+E)$，存储 $O(V+E)$；状态空间若是指数级，则本身仍不可直接暴力枚举。
