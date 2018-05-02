import json

with open('../../data/attn_vis_data.json', 'r') as data:
    d = json.load(data)

    for k, example in enumerate(d):
        attn_dist = example['attn_dists']
        input_list = example['article_lst']
        output_list = example['decoded_lst']

        cross_prod = []

        for i, output_token in enumerate(output_list):
            for j, input_token in enumerate(input_list):
                if (j >= len(attn_dist[i])):
                    break
                
                attn_weight = attn_dist[i][j]
                
                record = {
                    'outputIndex': i,
                    'outputToken': output_token,
                    'inputIndex': j,
                    'inputToken': input_token,
                    'weight': attn_weight
                }

                cross_prod.append(record)

        with open('data_{0}.json'.format(k), 'w') as out:
            json.dump(cross_prod, out, indent=2)