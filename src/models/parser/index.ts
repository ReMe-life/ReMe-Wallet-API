import { ExpectableError } from './../../exception'

import * as Templates from '../templates'
export { Templates }

export const Input = {
    parse: function (input: any, template: any): any {
        const result = {
            missing: '',
            data: {}
        }

        const allProps = template.required.concat(template.optional)

        for (let i = 0; i < allProps.length; i++) {
            const prop = allProps[i]

            if (input[prop] === undefined && i < template.required.length) {
                result.missing = prop
                return result
            }

            if (template.subTemplates && template.subTemplates[prop]) {
                if (template.subTemplates[prop].type === 'array') {
                    result.data[prop] = []
                    for (let j = 0; j < input[prop].length; j++) {
                        const arrayParsed = Input.parse(input[prop][j], template.subTemplates[prop])
                        if (arrayParsed.missing) {
                            result.missing = `${prop}.${arrayParsed.missing}`
                        } else {
                            result.data[prop].push(arrayParsed.data)
                        }
                    }
                } else {
                    const parsed = Input.parse(input[prop], template.subTemplates[prop])
                    if (parsed.missing) {
                        result.missing = `${prop}.${parsed.missing}`
                    } else {
                        result.data[prop] = parsed.data
                    }
                }
            } else if (!Input.isEmpty(input)) {
                result.data[prop] = input[prop]
            }
        }

        return result
    },
    parseRequire: function (input: any, template: any): any {
        const parsed = Input.parse(input, template)
        if (parsed.missing) {
            throw new ExpectableError(`Input should have ${parsed.missing}`)
        }

        return parsed.data
    },
    notEmpty: function (input: any) {
        if (Input.isEmpty(input)) {
            throw new ExpectableError('Input should not be empty')
        }
    },
    notBoolOrEmpty: function (input: any) {
        if (Input.isEmpty(input) || typeof input === 'boolean') {
            throw new ExpectableError('Input should not be empty or boolean')
        }

        return input
    },
    isEmpty: function (input: any): boolean {
        return (
            input === undefined ||
            input === null ||
            input === {} ||
            input === [] ||
            input === ''
        )
    }
}
