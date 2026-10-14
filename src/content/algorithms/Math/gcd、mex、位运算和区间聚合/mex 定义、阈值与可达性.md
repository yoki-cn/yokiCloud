---
kind: algorithm
title: mex 定义、阈值与可达性
updated: 2026-10-12
status: draft
order: 1110500
tags:
  - 数论
  - 位运算
  - 区间统计
---

多重集 $A$ 的 $\operatorname{mex}(A)$ 是不在 $A$ 中的最小非负整数。只计是否出现，负数不会影响 mex。


$$
\boxed{\operatorname{mex}(A)\ge k\iff\{0,1,\ldots,k-1\}\subseteq A,}
$$


$$
\boxed{\operatorname{mex}(A)=k\iff\{0,\ldots,k-1\}\subseteq A\ \land\ k\notin A.}
$$


长度 $n$ 的数组整体 mex 至多 $n$；固定 $|A|=n$，通常只需维护值域 $[0,n]$。$A\subseteq B\implies\operatorname{mex}(A)\le\operatorname{mex}(B)$。对于有重复值的多重集，删除一个元素只有在删掉某值最后一份时才可能改变 mex。

普通离散化不保持 mex。例如 $\operatorname{mex}\{1,3\}=0$，而重标号为 $\{0,1\}$ 后 mex 变为 $2$。
