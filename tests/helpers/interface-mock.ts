export type InterfaceMock<T extends { [key in string]: any}> = {
    [key in keyof T]: jest.Mock<ReturnType<T[key]>, Parameters<T[key]>>
}

export function ClassMock<T extends {}>(implementation: any = () => null): jest.Mock<T, []> {
    return jest.fn<T, []>(implementation)
}


export type ObjectMock<T extends { [key in string]: any }> = { [K in keyof T]: jest.Mock<ReturnType<T[K]>, Parameters<T[K]>>}
