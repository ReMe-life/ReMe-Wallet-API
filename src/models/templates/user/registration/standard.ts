export const Standard = {
    required: [
        'email',
        'password',
        'wallet'
    ],
    subTemplates: {
        wallet: {
            required: [
                'address',
                'json'
            ],
            // @ts-ignore
            optional: []
        }
    },
    // @ts-ignore
    optional: []
}
