---
kind: algorithm
title: 色多项式、删除收缩与 chromatic symmetric function
updated: 2026-10-12
status: draft
order: 1031000
tags:
  - 图论
  - 树
  - 计数
---

对边 $e$ 非自环，有


$$
\chi_G(q)=\chi_{G-e}(q)-\chi_{G/e}(q),\qquad\chi_{G_1\sqcup G_2}(q)=\chi_{G_1}(q)\chi_{G_2}(q).
$$


$$
\chi_{K_n}(q)=q^{\underline n},\qquad \chi_{\text{树 }n\text{ 点}}(q)=q(q-1)^{n-1},
$$


$$
\chi_{C_n}(q)=(q-1)^n+(-1)^n(q-1)\quad(n\ge3).
$$


**Tutte 多项式** $T_G(x,y)=\sum_{A\subseteq E}(x-1)^{r(E)-r(A)}(y-1)^{|A|-r(A)}$，其中 $r(A)=|V|-c(V,A)$。连通图：$T_G(1,1)=\tau(G)$；一般图 $\chi_G(q)=(-1)^{|V|-c(G)}q^{c(G)}T_G(1-q,0)$。
