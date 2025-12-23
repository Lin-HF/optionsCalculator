# 价格计算器设计文档

## 概述

价格计算器是一个基于React的响应式Web应用程序，采用三列布局设计，每列对应不同的时间周期（本周五、下周五、下下周五）。每列包含多个价格计算器组，用户可以输入价格值，系统自动计算并显示平均值。应用程序需要严格按照提供的手绘UI设计实现，包括精确的布局、颜色方案和交互行为。

## 架构

### 整体架构
应用程序采用现代React架构，使用函数组件和Hooks进行状态管理：

```
价格计算器应用
├── App组件（主容器）
├── DateHeader组件（日期显示）
├── CalculatorColumn组件（计算器列）
├── CalculatorGroup组件（计算器组）
├── PriceInput组件（价格输入框）
├── AverageDisplay组件（平均值显示）
└── 工具函数（日期计算、平均值计算）
```

### 技术栈
- **前端框架**: React 18+ with TypeScript
- **样式**: CSS Modules 或 Styled Components
- **构建工具**: Vite 或 Create React App
- **状态管理**: React useState/useEffect Hooks
- **响应式设计**: CSS Grid/Flexbox + Media Queries

## 组件和接口

### 1. App组件
主应用容器，负责整体布局和状态协调。

```typescript
interface AppProps {}

interface AppState {
  // 所有输入值的状态
  inputValues: Record<string, number>;
}
```

### 2. DateHeader组件
显示每列对应的日期信息。

```typescript
interface DateHeaderProps {
  weekOffset: number; // 0=本周, 1=下周, 2=下下周
}
```

### 3. CalculatorColumn组件
单个计算器列，包含日期头部和多个计算器组。

```typescript
interface CalculatorColumnProps {
  weekOffset: number;
  calculatorGroups: CalculatorGroupConfig[];
}
```

### 4. CalculatorGroup组件
单个计算器组，包含两个输入框和一个或多个平均值显示。

```typescript
interface CalculatorGroupProps {
  input1Id: string;
  input2Id: string;
  outputs: OutputConfig[];
  onValueChange: (id: string, value: number) => void;
}

interface OutputConfig {
  id: string;
  position: 'left' | 'right';
  inputs: string[]; // 参与计算的输入框ID
}
```

### 5. PriceInput组件
价格输入框，具有红色边框样式。

```typescript
interface PriceInputProps {
  id: string;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
}
```

### 6. AverageDisplay组件
平均值显示，使用黑色文字。

```typescript
interface AverageDisplayProps {
  value: number;
  label: string;
}
```

## 数据模型

### 输入值状态
```typescript
type InputValues = {
  // 左列
  A1: number;
  A2: number;
  C1: number;
  E1: number;
  E2: number;
  F1: number;
  
  // 中列
  B1: number;
  B2: number;
  D1: number;
  G1: number;
  H1: number;
  H2: number;
  
  // 右列
  I1: number;
  I2: number;
  J1: number;
  J2: number;
};
```

### 计算配置
```typescript
type CalculationConfig = {
  [key: string]: {
    inputs: string[];
    position: 'left' | 'right';
  };
};

const CALCULATIONS: CalculationConfig = {
  A3: { inputs: ['A1', 'A2'], position: 'right' },
  C2: { inputs: ['A2', 'C1'], position: 'left' },
  E3: { inputs: ['E1', 'E2'], position: 'right' },
  F2: { inputs: ['E1', 'F1'], position: 'left' },
  B3: { inputs: ['B1', 'B2'], position: 'right' },
  D2: { inputs: ['B2', 'D1'], position: 'left' },
  H3: { inputs: ['H1', 'H2'], position: 'right' },
  G2: { inputs: ['G1', 'H1'], position: 'left' },
  I3: { inputs: ['I1', 'I2'], position: 'right' },
  J3: { inputs: ['J1', 'J2'], position: 'right' },
};
```

## 布局设计

### 桌面布局（≥768px）
```css
.app-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 2rem;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}
```

### 移动布局（<768px）
```css
.app-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem;
}
```

### 计算器组布局
每个计算器组采用相对定位，确保输入框和输出值的精确位置匹配手绘设计：

```css
.calculator-group {
  position: relative;
  min-height: 200px;
  margin-bottom: 2rem;
}

.input-container {
  position: absolute;
  /* 具体位置根据手绘图调整 */
}

.output-container {
  position: absolute;
  /* 具体位置根据手绘图调整 */
}
```

## 正确性属性

*属性是一个特征或行为，应该在系统的所有有效执行中保持为真——本质上，是关于系统应该做什么的正式声明。属性作为人类可读规范和机器可验证正确性保证之间的桥梁。*

### 属性反思

在分析所有可测试的验收标准后，我识别出以下核心属性类别：
1. 日期计算属性 - 验证相对日期计算的正确性
2. 平均值计算属性 - 验证所有计算器的数学正确性  
3. 响应性更新属性 - 验证输入变化时的实时更新
4. 数值处理属性 - 验证边界情况和格式化

通过合并相似的验收标准，我将多个重复的平均值计算测试（需求2.1-2.4, 3.1-3.4, 4.1-4.2）整合为一个通用的平均值计算属性，以避免冗余测试。

**属性 1: 周五日期计算正确性**
*对于任何* 给定的当前日期，计算出的本周五、下周五、下下周五日期应该分别相差0天、7天、14天（相对于最近的周五）
**验证: 需求 1.1, 1.2, 1.3, 1.4**

**属性 2: 平均值计算正确性**
*对于任何* 两个数值输入，计算出的平均值应该等于两个输入值的和除以2
**验证: 需求 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 3.4, 4.1, 4.2**

**属性 3: 响应性更新一致性**
*对于任何* 输入值的变化，所有依赖该输入的计算结果都应该立即更新为正确的新值
**验证: 需求 2.5, 3.5, 4.5**

**属性 4: 小数精度保持**
*对于任何* 小数输入值，计算结果应该保持适当的数学精度，不应出现浮点数精度错误
**验证: 需求 7.4**

**属性 5: 结果格式化一致性**
*对于任何* 计算结果，显示的小数位数应该不超过2位，并且格式保持一致
**验证: 需求 7.5**

**属性 6: 跨设备功能完整性**
*对于任何* 设备类型（桌面或移动），所有计算功能都应该正常工作并产生相同的结果
**验证: 需求 6.4**

## 错误处理

### 输入验证
- **无效输入**: 非数字输入将被忽略，保持当前值不变
- **空值处理**: 空输入框视为数值0参与计算
- **边界值**: 支持负数、零、小数和大数值输入

### 计算错误
- **除零保护**: 虽然平均值计算不涉及除零，但确保所有数学运算的安全性
- **精度控制**: 使用适当的数值精度避免浮点数计算误差
- **溢出处理**: 对于极大数值输入提供合理的处理

### UI错误恢复
- **状态一致性**: 确保UI状态与计算状态始终同步
- **渲染错误**: 提供错误边界组件捕获渲染异常
- **响应式失效**: 在布局计算失败时提供降级方案

## 测试策略

### 双重测试方法

本应用将采用单元测试和基于属性的测试相结合的综合测试策略：

**单元测试**覆盖：
- 特定的日期计算示例（如2024年12月15日的周五计算）
- 边界情况（空值、负数、极值）
- 组件集成点（输入变化到显示更新的流程）
- 响应式布局的特定断点测试

**基于属性的测试**覆盖：
- 使用**fast-check**库进行属性测试
- 每个属性测试运行最少100次迭代
- 验证上述定义的6个正确性属性
- 使用智能生成器创建有效的测试输入

**属性测试配置**：
- **测试库**: fast-check (JavaScript/TypeScript的属性测试库)
- **迭代次数**: 每个属性测试最少100次
- **标记格式**: 每个属性测试必须使用注释标记：`**Feature: price-calculator, Property {number}: {property_text}**`
- **实现要求**: 每个正确性属性必须对应一个单独的属性测试

**测试覆盖范围**：
- 核心计算逻辑的属性验证
- 日期计算函数的数学正确性
- UI组件的功能完整性
- 响应式行为的一致性验证

单元测试和属性测试相互补充：单元测试捕获具体的错误，属性测试验证通用的正确性。两者结合提供全面的测试覆盖，确保应用的可靠性和正确性。