---
kind: algorithm
title: Nim、Bash 与减法游戏
updated: 2026-10-12
status: draft
order: 1100200
tags:
  - 博弈论
---

普通 Nim：$r$ 堆分别有 $a_i\ge0$ 个石子，一步从某一堆取走任意正数，直到取完者赢：


$$
\operatorname{sg}(a)=a,\quad\operatorname{sg}(a_1,\ldots,a_r)=a_1\oplus\cdots\oplus a_r.
$$


Bash 游戏：一堆有 $n$ 枚石子，一次可以取 $1,2,\ldots,m$ 枚（$m\ge1$），则


$$
\operatorname{sg}(n)=n\bmod(m+1),\qquad n\text{ 必败}\iff n\equiv0\pmod{m+1}.
$$


一般减法集 $S\subset\mathbb N_{>0}$：


$$
g(0)=0,\qquad g(n)=\operatorname{mex}\{g(n-s):s\in S,\ s\le n\}.
$$


若允许多个堆且只能操作一堆，才可异或。周期性需要从递推本身证明，不能仅凭短前缀打表猜测。
