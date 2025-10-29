"""
# Python 示例

这是一个 **Python** 文档字符串示例。

## 功能特性

- 支持三引号注释
- 自动 Markdown 渲染
- 鼠标悬停即可查看

## 使用方法

将鼠标悬停在这个文档字符串上，你会看到格式化的 Markdown 内容。

> **提示**: Python 支持双引号和单引号的三引号注释
"""


def example_function():
    """
    # 函数说明
    
    这个函数用于演示文档字符串的 Markdown 渲染。
    
    ## 参数
    
    无参数
    
    ## 返回值
    
    返回字符串 `"Hello from Python!"`
    
    ## 示例
    
    ```python
    result = example_function()
    print(result)  # 输出: Hello from Python!
    ```
    """
    return "Hello from Python!"


class ExampleClass:
    '''
    # 类文档字符串
    
    这是一个使用**单引号**三引号的示例。
    
    ## 属性
    
    - name: 名称
    - value: 值
    
    ## 方法
    
    - get_info(): 获取信息
    '''
    
    def __init__(self, name: str, value: int):
        '''
        ## 构造函数
        
        初始化 ExampleClass 实例
        
        ### 参数
        
        - **name** (str): 实例名称
        - **value** (int): 实例值
        '''
        self.name = name
        self.value = value
    
    def get_info(self) -> str:
        """
        获取对象信息
        
        返回包含对象信息的字符串。
        
        格式：`name: value`
        """
        return f"{self.name}: {self.value}"


# 单行注释不会被渲染
# 即使是多行的
# 单行注释也不会


def another_example():
    # 函数内的注释也不会被渲染
    pass


if __name__ == "__main__":
    """
    # 主程序
    
    运行示例代码：
    
    1. 创建实例
    2. 调用方法
    3. 打印结果
    """
    obj = ExampleClass("测试", 42)
    print(obj.get_info())
    print(example_function())
