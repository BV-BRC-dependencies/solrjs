const assert = require('chai').assert
const Rql = require('./rql')

describe('Test Solr Translation genome operator', () => {
  it('Convert genome operator', (done) => {
    const parsed = Rql('genome(and(eq(taxon_lineage_ids,1234),eq(genome_status,Complete)))').toSolr({ defaultLimit: 25 })
    assert.equal(parsed, '&q=*&fq={!join fromIndex=genome from=genome_id to=genome_id}(taxon_lineage_ids:1234 AND genome_status:Complete)&rows=25')
    done()
  })
  it('Convert genome operator eq', (done) => {
    const parsed = Rql('genome(eq(taxon_lineage_ids,1234))').toSolr({ defaultLimit: 25 })
    assert.equal(parsed, '&q=*&fq={!join fromIndex=genome from=genome_id to=genome_id}taxon_lineage_ids:1234&rows=25')
    done()
  })
  it('Convert genome operator and', (done) => {
    const parsed = Rql('genome(and(eq(taxon_lineage_ids,1234),eq(host_name,Human)))').toSolr({ defaultLimit: 25 })
    assert.equal(parsed, '&q=*&fq={!join fromIndex=genome from=genome_id to=genome_id}(taxon_lineage_ids:1234 AND host_name:Human)&rows=25')
    done()
  })
  it('Convert genome operator or', (done) => {
    const parsed = Rql('genome(or(eq(taxon_lineage_ids,1234),eq(taxon_lineage_ids,567)))').toSolr({ defaultLimit: 25 })
    assert.equal(parsed, '&q=*&fq={!join fromIndex=genome from=genome_id to=genome_id}(taxon_lineage_ids:1234 OR taxon_lineage_ids:567)&rows=25')
    done()
  })
  it('Convert genome operator and(or)', (done) => {
    const parsed = Rql('genome(and(or(eq(taxon_lineage_ids,1234),eq(taxon_lineage_ids,567)),or(eq(host_name,Human),eq(host_name,Insect))))').toSolr({ defaultLimit: 25 })
    assert.equal(parsed, '&q=*&fq={!join fromIndex=genome from=genome_id to=genome_id}((taxon_lineage_ids:1234 OR taxon_lineage_ids:567) AND (host_name:Human OR host_name:Insect))&rows=25')
    done()
  })
  it('Convert genome operator multiple eq', (done) => {
    const parsed = Rql('genome(eq(taxon_lineage_ids,1234),eq(genome_status,Complete))').toSolr({ defaultLimit: 25 })
    assert.equal(parsed, '&q=*&fq={!join fromIndex=genome from=genome_id to=genome_id}(taxon_lineage_ids:1234 AND genome_status:Complete)&rows=25')
    done()
  })
  it('Convert genome operator in', (done) => {
    const parsed = Rql('genome(in(taxon_lineage_ids,(1234,64895)))').toSolr({ defaultLimit: 25 })
    assert.equal(parsed, '&q=*&fq={!join fromIndex=genome from=genome_id to=genome_id}(taxon_lineage_ids:(1234 OR 64895))&rows=25')
    done()
  })
  it('Convert genome operator lt gt', (done) => {
    const parsed = Rql('genome(gt(collection_year,2000),lt(collection_year,2020))').toSolr({ defaultLimit: 25 })
    assert.equal(parsed, '&q=*&fq={!join fromIndex=genome from=genome_id to=genome_id}(collection_year:[2000 TO *] AND collection_year:[* TO 2020])&rows=25')
    done()
  })
  it('Convert genome operator between', (done) => {
    const parsed = Rql('genome(between(collection_year,2000,2020))').toSolr({ defaultLimit: 25 })
    assert.equal(parsed, '&q=*&fq={!join fromIndex=genome from=genome_id to=genome_id}collection_year:[2000 TO 2020]&rows=25')
    done()
  })
  it('Convert genome operator to', (done) => {
    const parsed = Rql('genome(to(genome_ids),eq(taxon_lineage_ids,1234))').toSolr({ defaultLimit: 25 })
    assert.equal(parsed, '&q=*&fq={!join fromIndex=genome from=genome_id to=genome_ids}taxon_lineage_ids:1234&rows=25')
    done()
  })
  it('Convert genome operator with other ops', (done) => {
    const parsed = Rql('eq(feature_type,CDS)&genome(eq(taxon_lineage_ids,1234))').toSolr({ defaultLimit: 25 })
    assert.equal(parsed, '&q=feature_type:CDS AND *&fq={!join fromIndex=genome from=genome_id to=genome_id}taxon_lineage_ids:1234&rows=25')
    done()
  })
  it('Convert genome operator with other ops', (done) => {
    const parsed = Rql('or(eq(feature_type,CDS),eq(feature_type,gene))&genome(eq(taxon_lineage_ids,1234))').toSolr({ defaultLimit: 25 })
    assert.equal(parsed, '&q=(feature_type:CDS OR feature_type:gene) AND *&fq={!join fromIndex=genome from=genome_id to=genome_id}taxon_lineage_ids:1234&rows=25')
    done()
  })
})
