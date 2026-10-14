---
kind: algorithm
title: Cauchy 周长公式、等周与等直径
updated: 2026-10-12
status: draft
order: 1071800
tags:
  - 平面几何
---

凸平面图形 $K$ 的投影宽度 $w(\theta)$，其周长


$$
P(K)=\int_0^\pi w(\theta)\,d\theta.
$$


若随机 $\theta\sim U[0,\pi)$，则 $\mathbb E[w(\theta)]=P(K)/\pi$。一般平面可测有限周长区域的等周不等式


$$
P^2\ge4\pi A,
$$


等号当且仅当区域（按常见有限周长假设）为圆盘。直径为 $D$ 的平面集合，其凸包面积不超过 $\pi D^2/4$（等直径面积不等式）。
