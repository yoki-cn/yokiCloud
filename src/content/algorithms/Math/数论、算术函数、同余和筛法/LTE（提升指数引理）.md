---
kind: algorithm
title: LTE（提升指数引理）
updated: 2026-10-12
status: draft
order: 1051200
tags:
  - 数论
---

奇素数 $p$，整数 $a,b$，$p\mid(a-b)$、$p\nmid ab$，$n\ge1$ 时


$$
v_p(a^n-b^n)=v_p(a-b)+v_p(n).
$$


奇素数 $p\mid(a+b)$、$n$ 为奇数时


$$
v_p(a^n+b^n)=v_p(a+b)+v_p(n).
$$


若 $a,b$ 都为奇数，则


$$
v_2(a^n-b^n)=\begin{cases}v_2(a-b),&n\text{ 奇},\\v_2(a-b)+v_2(a+b)+v_2(n)-1,&n\text{ 偶}.\end{cases}
$$


条件缺失会导致估值错误，特别是 $p=2$ 不能直接套奇素数版本。
