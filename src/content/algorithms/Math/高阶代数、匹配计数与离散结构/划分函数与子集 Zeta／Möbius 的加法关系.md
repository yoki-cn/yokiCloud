---
kind: algorithm
title: 划分函数与子集 Zeta／Möbius 的加法关系
updated: 2026-10-12
status: draft
order: 1131300
tags:
  - 高阶代数
  - 图论
  - 组合数学
---

集合函数 $f:2^{[n]}\to K$，记


$$
\widehat f(S)=\sum_{T\subseteq S}f(T),\qquad f(S)=\sum_{T\subseteq S}(-1)^{|S|-|T|}\widehat f(T).
$$


若 $h(S)=\sum_{A\cup B=S}f(A)g(B)$（OR 卷积），有


$$
\widehat h(S)=\widehat f(S)\widehat g(S).
$$


如果要求 $A\cap B=\emptyset$，必须转为不交子集卷积，不能直接将 OR 卷积套用；有序拆分与无序划分又有 $k!$ 因子差异。
