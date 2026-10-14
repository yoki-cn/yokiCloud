---
kind: algorithm
title: 有限正常规则无偏博弈与 Sprague–Grundy 定理
updated: 2026-10-12
status: draft
order: 1100100
tags:
  - 博弈论
---

有限、无环、两人轮流操作、双方合法操作相同且无合法操作者输的博弈，其状态 $s$ 的 SG 值定义为


$$
\operatorname{sg}(s)=\operatorname{mex}\{\operatorname{sg}(t):s\to t\},\qquad \operatorname{sg}(\text{终局})=0.
$$



$$
s\text{ 为必败态}\iff\operatorname{sg}(s)=0,\qquad s\text{ 为必胜态}\iff\operatorname{sg}(s)\ne0.
$$


当每次恰好选择一个**互不影响的**子游戏操作，整个游戏 $G=G_1+\cdots+G_r$ 满足


$$
\boxed{\operatorname{sg}(G)=\operatorname{sg}(G_1)\oplus\cdots\oplus\operatorname{sg}(G_r).}
$$


令 $X=\bigoplus_i\operatorname{sg}(G_i)\ne0$，总能找到 $i$ 使 $\operatorname{sg}(G_i)\oplus X<\operatorname{sg}(G_i)$，且这个较小值必是某一步后继的 SG 值。该事实可以构造必胜步。

**限制：**不能直接用于有环可能无限重复、带概率、非对称行动、共享资源、每步允许同时修改多个分量或“最后一步者输”的反常规则。
