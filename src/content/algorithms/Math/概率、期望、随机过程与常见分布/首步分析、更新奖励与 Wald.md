---
kind: algorithm
title: 首步分析、更新奖励与 Wald
updated: 2026-10-12
status: draft
order: 1061700
tags:
  - 概率
  - 期望
---

对于一步费用 $c_i$、转移概率 $P_{ij}$，总奖励的期望 $f_i$ 满足


$$
f_i=c_i+\sum_jP_{ij}f_j,
$$


终止状态 $f_i=0$，或按题意给定终止奖励。处理二阶矩时将 $(c_i+X)^2=c_i^2+2c_iX+X^2$ 展开。

**Wald 等式**：对于独立同分布且可积增量 $X_i$、满足适当可积停止时刻条件的 $T$，


$$
\mathbb E\left[\sum_{i=1}^T X_i\right]=\mathbb ET\,\mathbb EX_1.
$$


不能仅因 $T$ 是随机变量就使用；必须满足停止时刻和可积性等条件。
